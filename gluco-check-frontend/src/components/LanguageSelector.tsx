import React from "react";
import {
  Button,
  Divider,
  Hidden,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
} from "@material-ui/core";
import { ExpandMore, Translate } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { AvailableLanguage } from "../lib/enums";

const useStyles = makeStyles((theme) => ({
  selectorLabel: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const MENU_ITEM_ATTRIBUTE = "data-language";

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();

  const classes = useStyles();

  const menuState = usePopupState({
    variant: "popover",
    popupId: "languageMenu",
  });

  const handleItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const incomingSelection = event.currentTarget.getAttribute(
      MENU_ITEM_ATTRIBUTE
    );
    if (
      incomingSelection &&
      Object.values(AvailableLanguage).includes(
        incomingSelection as AvailableLanguage
      )
    ) {
      i18n.changeLanguage(incomingSelection);
    }

    menuState.close();
  };

  return (
    <div>
      <Button
        color="inherit"
        {...bindTrigger(menuState)}
        aria-label={t(`languageSelector.buttonLabel`)}
      >
        <Translate />
        <Hidden xsDown>
          <span className={classes.selectorLabel}>
            {t(`languageSelector.buttonLabel`)}
          </span>
        </Hidden>
        <ExpandMore />
      </Button>
      <Paper>
        <Menu {...bindMenu(menuState)}>
          {Object.values(AvailableLanguage).map((value, index) => {
            const dataProp = {
              [MENU_ITEM_ATTRIBUTE]: value,
            };
            return (
              <MenuItem
                key={`language-selector-${index}`}
                onClick={handleItemClick}
                selected={value === i18n.language}
                {...dataProp}
              >
                {t(`languageSelector.availableLanguageLabels.${value}`)}
              </MenuItem>
            );
          })}
          <Divider />
          <MenuItem
            onClick={() => {
              window.open(t("urls.translations"), "_blank");
            }}
          >
            {t(`languageSelector.contribute`)}
          </MenuItem>
        </Menu>
      </Paper>
    </div>
  );
}
