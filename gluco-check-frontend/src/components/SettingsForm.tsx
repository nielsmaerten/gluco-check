import React, { useEffect, useState } from "react";
import { debounce } from "debounce";

import {
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  makeStyles,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@material-ui/core";
import semver from "semver";
import { Close, Lock } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import { useForm, Controller, DeepMap, FieldError } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BloodGlucoseUnit, DiabetesMetric } from "../lib/enums";
import { SettingsFormData } from "../lib/types";
import {
  ALERT_AUTOHIDE_DURATION,
  APP_DEBUG,
  VALIDATION_DEBOUNCE_DURATION,
} from "../lib/constants";
import TokenSetup from "../components/TokenSetup";
import { NightscoutValidationClient } from "../lib/NightscoutValidationClient/NightscoutValidationClient";
import { NightscoutBloodGlucoseUnitMapping } from "../lib/mappings";

type SettingsFormProps = {
  alertAutohideDuration?: number;
  defaultMetrics: DiabetesMetric[];
  glucoseUnit: BloodGlucoseUnit;
  nightscoutToken: string;
  nightscoutUrl: string;
  nightscoutValidator?: NightscoutValidationClient;
  onSubmit: (data: SettingsFormData) => {};
  shouldShowGlucoseUnitsField?: boolean;
  validationDebounceDuration?: number;
};

const SettingsFormAlert = (props: any) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  form: {
    "& .MuiFormControl-root": {
      marginBottom: theme.spacing(4),
    },
    "& .MuiFormHelperText-root .MuiLink-button": {
      color: theme.palette.text.secondary,
      textDecoration: "underline",
    },
  },
  checkboxArray: {
    "& label": {
      textTransform: "capitalize",
    },
  },
  helperWarning: {
    "& .MuiFormLabel-root, & .MuiInputBase-root, & .MuiInputBase-input, & .MuiFormHelperText-root, & .MuiSelect-root": {
      color: theme.palette.warning.main,
    },
    "& .MuiFormLabel-root.Mui-disabled, & .MuiInputBase-root.Mui-disabled, & .MuiInputBase-input.Mui-disabled, & .MuiFormHelperText-root.Mui-disabled, & .MuiSelect-root.Mui-disabled": {
      color: theme.palette.warning.light,
    },
    "& .MuiInputBase-root.MuiInput-underline:before, & .MuiInputBase-root.MuiInput-underline.Mui-focused:before, & .MuiInputBase-root.MuiInput-underline:after, & .MuiInputBase-root.MuiInput-underline.Mui-focused:after": {
      borderColor: theme.palette.warning.main,
    },
    "& .MuiInputBase-root.Mui-disabled.MuiInput-underline:before, & .MuiInputBase-root.Mui-disabled.MuiInput-underline.Mui-focused:before, & .MuiInputBase-root.Mui-disabled.MuiInput-underline:after, & .MuiInputBase-root.Mui-disabled.MuiInput-underline.Mui-focused:after": {
      borderColor: theme.palette.warning.light,
    },
    "& .MuiInputAdornment-root svg": {
      fill: theme.palette.warning.main,
    },
  },
  checkboxWithWarning: {
    "& .MuiFormControlLabel-label.Mui-disabled": {
      color: theme.palette.warning.light,
    },
    "& .MuiFormControlLabel-label": {
      color: theme.palette.warning.main,
    },
    "& .MuiFormControlLabel-label::after": {
      content: "' *'",
    },
    "& input[type=checkbox]:disabled + svg": {
      fill: theme.palette.warning.light,
    },
    "& input[type=checkbox] + svg": {
      fill: theme.palette.warning.main,
    },
  },
}));

export const returnHandleOpenTokenDialog = (
  tokenDialogOpen: boolean,
  setTokenDialogOpen: Function
) => {
  return () => {
    setTokenDialogOpen(!tokenDialogOpen);
  };
};

export default function SettingsForm({
  alertAutohideDuration,
  defaultMetrics,
  glucoseUnit,
  nightscoutToken,
  nightscoutUrl,
  nightscoutValidator,
  onSubmit,
  shouldShowGlucoseUnitsField,
  validationDebounceDuration,
}: SettingsFormProps) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [warnings, setWarnings] = useState<
    DeepMap<SettingsFormData, FieldError>
  >({});

  // until the backend tells us otherwise, assume
  // everything is supported
  const [supportedMetrics, setSupportedMetrics] = useState<DiabetesMetric[]>(
    Object.values(DiabetesMetric)
  );

  const validator = async (data: SettingsFormData) => {
    let errors: DeepMap<SettingsFormData, FieldError> = {};
    let warnings: DeepMap<SettingsFormData, FieldError> = {};
    let augmentedValues: Partial<SettingsFormData> = {};
    if (data.nightscoutUrl === "") {
      errors.nightscoutUrl = {
        type: "required",
        message: t("settings.form.helperText.nightscoutUrl.required"),
      };
    } else {
      if (nightscoutValidator) {
        try {
          const nsvResponse = await nightscoutValidator.fetchValidationStatus(
            data.nightscoutUrl,
            data.nightscoutToken
          );
          if (nsvResponse) {
            if (nsvResponse.url.isValid && nsvResponse.url.pointsToNightscout) {
              augmentedValues.nightscoutUrl = nsvResponse.url.parsed;
            }
            if (nsvResponse.token.isValid) {
              augmentedValues.nightscoutToken = nsvResponse.token.parsed;
            }
            if (!nsvResponse.url.pointsToNightscout) {
              warnings.nightscoutUrl = {
                type: "validate",
                message: t(
                  "settings.form.helperText.nightscoutUrl.notNightscout"
                ),
              };
            }
            if (nsvResponse.url.pointsToNightscout) {
              if (data.nightscoutToken === "") {
                warnings.nightscoutToken = {
                  type: "validate",
                  message: t("settings.form.helperText.nightscoutToken.empty"),
                };
              } else if (!nsvResponse.token.isValid) {
                warnings.nightscoutToken = {
                  type: "validate",
                  message: t(
                    "settings.form.helperText.nightscoutToken.invalid"
                  ),
                };
              }
              if (
                nsvResponse.nightscout.glucoseUnit !==
                NightscoutBloodGlucoseUnitMapping[data.glucoseUnit]
              ) {
                warnings.glucoseUnit = {
                  type: "validate",
                  message: t("settings.form.helperText.glucoseUnits.mismatch"),
                };
              }
              if (
                semver.valid(nsvResponse.nightscout.version) &&
                semver.valid(nsvResponse.nightscout.minSupportedVersion) &&
                semver.lt(
                  nsvResponse.nightscout.version,
                  nsvResponse.nightscout.minSupportedVersion
                )
              ) {
                warnings.nightscoutUrl = {
                  type: "validate",
                  message: t(
                    "settings.form.helperText.nightscoutUrl.needsUpgrade",
                    {
                      version: nsvResponse.nightscout.minSupportedVersion.toString(),
                    }
                  ),
                };
              }
              const userHasSelectedUnsupportedMetrics = data.defaultMetrics
                .filter((metric) => metric !== DiabetesMetric.Everything)
                .map((metric) => nsvResponse.discoveredMetrics.includes(metric))
                .includes(false);
              if (userHasSelectedUnsupportedMetrics === true) {
                const message = warnings.nightscoutToken
                  ? t(
                      "settings.form.helperText.defaultMetrics.notAvailableInvalidToken"
                    )
                  : t(
                      "settings.form.helperText.defaultMetrics.notAvailableValidToken"
                    );
                warnings.defaultMetrics = [
                  {
                    type: "validate",
                    message,
                  },
                ];
              }
              if (data.defaultMetrics.length === 0) {
                errors.defaultMetrics = [
                  {
                    type: "validate",
                    message: t(
                      "settings.form.helperText.defaultMetrics.required"
                    ),
                  },
                ];
              }
            }

            // can't do this if component has already been unmounted,
            // you'll leave it (and the connection) hanging
            setSupportedMetrics(nsvResponse.discoveredMetrics);
            setWarnings(warnings);
          } else {
            throw new Error("No response returned");
          }
        } catch (e) {
          /* istanbul ignore if  */
          if (APP_DEBUG) {
            console.error(
              "Unable to fetch validation info for Nightscout site",
              e
            );
          }
        }
      }
    }

    // always return no errors, we are using resolver
    // for its lifecycle, but never want to block submission
    if (Object.keys(errors).length) {
      return {
        values: {},
        errors,
      };
    }
    return {
      values: { ...data, ...augmentedValues },
      errors: {},
    };
  };

  const {
    control,
    errors,
    formState,
    getValues,
    handleSubmit,
    register,
    trigger,
  } = useForm<SettingsFormData>({
    resolver: nightscoutValidator ? validator : undefined,
  });

  // trigger form validation on first component render
  useEffect(() => {
    nightscoutValidator && trigger();
  }, [nightscoutValidator, trigger]);

  const debouncedOnChangeHandler = debounce(async () => {
    await trigger();
  }, validationDebounceDuration);

  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [formHasSubmissionError, setFormHasSubmissionError] = useState(false);
  const [formHasSubmittedSuccess, setFormHasSubmittedSuccess] = useState(false);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);

  const formHasErrors = Boolean(Object.keys(formState.errors).length);
  const canEditFields = !formState.isSubmitting;
  const canSubmitForm =
    formState.isDirty && !formHasErrors && !formState.isSubmitting;

  const glucoseUnits = Object.entries(BloodGlucoseUnit).map(([_, v]) => {
    return { label: v, value: v };
  });

  const metrics = Object.entries(DiabetesMetric).map(
    ([enumCase, enumValue]) => {
      return { label: t(`diabetesMetrics.${enumCase}`), value: enumValue };
    }
  );

  const onFormSubmit = async (data: SettingsFormData) => {
    try {
      setFormHasSubmissionError(false);
      setFormIsSubmitting(true);
      await onSubmit(data);
      setFormIsSubmitting(false);
      setFormHasSubmittedSuccess(true);
    } catch (e) {
      setFormHasSubmissionError(true);
    }
  };

  const formReset = () => {
    setFormIsSubmitting(false);
    setFormHasSubmissionError(false);
    setFormHasSubmittedSuccess(false);
  };

  const handleFormSuccessAlertClose = () => {
    formReset();
  };

  const handleCheck = (newMetric: DiabetesMetric) => {
    const { defaultMetrics } = getValues();

    // toggle on or off
    let newMetrics = defaultMetrics?.includes(newMetric)
      ? defaultMetrics?.filter((metric) => metric !== newMetric)
      : [...defaultMetrics, newMetric];

    // if user is selecting everything, then return ONLY everything
    if (newMetrics.includes(DiabetesMetric.Everything)) {
      newMetrics = Object.values(DiabetesMetric);
    }
    return newMetrics;
  };

  const TokenDialog = (
    <Dialog
      open={tokenDialogOpen}
      aria-labelledby="token-dialog-title"
      fullWidth
    >
      <DialogTitle id="token-dialog-title">
        {t("tokenDialog.title")}
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={returnHandleOpenTokenDialog(
            tokenDialogOpen,
            setTokenDialogOpen
          )}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TokenSetup />
      </DialogContent>
    </Dialog>
  );

  const SettingsForm = (
    <form
      className={classes.form}
      onSubmit={handleSubmit(onFormSubmit)}
      data-testid="settings-form"
    >
      <FormControl
        error={Boolean(errors.nightscoutUrl)}
        className={warnings.nightscoutUrl ? classes.helperWarning : undefined}
        fullWidth={true}
      >
        <InputLabel htmlFor="settings-form-field-url">
          {t("settings.form.labels.nightscoutUrl")}
        </InputLabel>
        <Input
          defaultValue={nightscoutUrl}
          fullWidth={true}
          disabled={!canEditFields}
          id="settings-form-field-url"
          inputProps={{
            "data-testid": "settings-form-field-url",
            onChange: debouncedOnChangeHandler,
          }}
          inputRef={register}
          name="nightscoutUrl"
        ></Input>
        {errors.nightscoutUrl && (
          <FormHelperText>{errors.nightscoutUrl.message}</FormHelperText>
        )}
        {warnings.nightscoutUrl && (
          <FormHelperText>{warnings.nightscoutUrl.message}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth={true}
        className={warnings.nightscoutToken ? classes.helperWarning : undefined}
      >
        <InputLabel htmlFor="settings-form-field-token">
          {t("settings.form.labels.nightscoutToken")}
        </InputLabel>
        <Input
          defaultValue={nightscoutToken}
          fullWidth={true}
          disabled={!canEditFields}
          id="settings-form-field-token"
          inputProps={{
            "data-testid": "settings-form-field-token",
            onChange: debouncedOnChangeHandler,
          }}
          inputRef={register}
          name="nightscoutToken"
          startAdornment={
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          }
        ></Input>
        {warnings.nightscoutToken && (
          <FormHelperText className={classes.helperWarning}>
            {warnings.nightscoutToken.message}
          </FormHelperText>
        )}
        <FormHelperText>
          <Link
            component="button"
            type="button"
            onClick={returnHandleOpenTokenDialog(
              tokenDialogOpen,
              setTokenDialogOpen
            )}
          >
            {t("settings.form.helperText.nightscoutToken.default")}
          </Link>
        </FormHelperText>
      </FormControl>

      <FormControl
        className={warnings.defaultMetrics ? classes.helperWarning : undefined}
        component="fieldset"
        data-testid="settings-form-fieldset-metrics"
        error={Boolean(errors.defaultMetrics)}
      >
        <FormLabel component="legend">
          {t("settings.form.labels.defaultMetrics")}
        </FormLabel>
        <FormGroup row className={classes.checkboxArray}>
          <Controller
            control={control}
            name="defaultMetrics"
            defaultValue={defaultMetrics}
            // @ts-ignore
            render={(props) => {
              const { defaultMetrics: formStateDefaultMetrics } = getValues();
              const everythingIsSelected = formStateDefaultMetrics
                ? formStateDefaultMetrics.includes(DiabetesMetric.Everything)
                : defaultMetrics.includes(DiabetesMetric.Everything);

              return metrics.map((metric) => {
                const shouldPresentWarningLabel =
                  metric.value !== DiabetesMetric.Everything &&
                  props.value.includes(metric.value) &&
                  !errors.nightscoutUrl &&
                  !warnings.nightscoutUrl &&
                  !supportedMetrics.includes(metric.value);

                return (
                  <FormControlLabel
                    className={
                      shouldPresentWarningLabel
                        ? classes.checkboxWithWarning
                        : undefined
                    }
                    control={
                      <Checkbox
                        onChange={() => {
                          props.onChange(handleCheck(metric.value));
                          debouncedOnChangeHandler();
                        }}
                        checked={
                          everythingIsSelected ||
                          props.value.includes(metric.value)
                        }
                        disabled={
                          !canEditFields ||
                          (everythingIsSelected &&
                            metric.value !== DiabetesMetric.Everything)
                        }
                      />
                    }
                    key={metric.value}
                    label={metric.value}
                  />
                );
              });
            }}
          />
        </FormGroup>
        {warnings.defaultMetrics && (
          <FormHelperText className={classes.helperWarning}>
            {warnings.defaultMetrics[0]?.message}
          </FormHelperText>
        )}
        {errors.defaultMetrics && (
          <FormHelperText>{errors.defaultMetrics[0]?.message}</FormHelperText>
        )}
      </FormControl>

      {/* only show the glucose units field when in debug mode,
          otherwise we're just going to pass the discovered units
          in a hidden field */}
      {shouldShowGlucoseUnitsField ? (
        <FormControl
          className={warnings.glucoseUnit ? classes.helperWarning : undefined}
          fullWidth={true}
        >
          <InputLabel htmlFor="settings-form-field-bg">
            {t("settings.form.labels.glucoseUnits")}
          </InputLabel>
          <Controller
            name="glucoseUnit"
            rules={{ required: true }}
            control={control}
            defaultValue={glucoseUnit}
            as={
              <Select
                disabled={!canEditFields}
                fullWidth={true}
                inputProps={{
                  "data-testid": "settings-form-field-bg",
                }}
                id="settings-form-field-bg"
                onChange={debouncedOnChangeHandler}
              >
                {glucoseUnits.map((item) => (
                  <MenuItem value={item.value} key={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            }
          />
          {warnings.glucoseUnit && (
            <FormHelperText>{warnings.glucoseUnit.message}</FormHelperText>
          )}
        </FormControl>
      ) : (
        <TextField
          defaultValue={glucoseUnit}
          inputRef={register}
          inputProps={{
            "data-testid": "settings-form-field-bg",
          }}
          name="glucoseUnit"
          type="hidden"
        />
      )}

      <Container disableGutters={true} maxWidth="lg">
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item>
            <Button
              color="primary"
              data-testid="settings-form-submit"
              type="submit"
              variant="contained"
              disabled={!canSubmitForm}
            >
              {t("settings.form.submitButton")}
            </Button>
          </Grid>
          {formState.isValidating && (
            <Grid item>
              <FormHelperText
                component="div"
                data-testid="settings-form-validation-progress-indicator"
              >
                <CircularProgress size={10} />{" "}
                {t("settings.form.validationInProgress")}
              </FormHelperText>
            </Grid>
          )}
        </Grid>
      </Container>
    </form>
  );

  return (
    <>
      <Snackbar
        autoHideDuration={alertAutohideDuration}
        open={formIsSubmitting}
      >
        <SettingsFormAlert
          data-testid="settings-form-submitting"
          severity="warning"
        >
          {t("settings.form.submitStatus.submitting")}
        </SettingsFormAlert>
      </Snackbar>
      <Snackbar
        autoHideDuration={alertAutohideDuration}
        onClose={handleFormSuccessAlertClose}
        open={formHasSubmittedSuccess}
      >
        <SettingsFormAlert
          data-testid="settings-form-submitted"
          severity="success"
        >
          {t("settings.form.submitStatus.submitted")}
        </SettingsFormAlert>
      </Snackbar>
      <Snackbar
        autoHideDuration={alertAutohideDuration}
        open={formHasSubmissionError}
      >
        <SettingsFormAlert data-testid="settings-form-error" severity="error">
          {t("settings.form.submitStatus.error")}
        </SettingsFormAlert>
      </Snackbar>

      {SettingsForm}
      {TokenDialog}
    </>
  );
}

SettingsForm.defaultProps = {
  autohideDuration: ALERT_AUTOHIDE_DURATION,
  shouldShowGlucoseUnitsField: false,
  validationDebounceDuration: VALIDATION_DEBOUNCE_DURATION,
};
