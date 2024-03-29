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
import { CONTRIBUTE_TRANSLATIONS } from "../lib/constants";
import { useLocation } from "react-router-dom";
import { replaceLanguageInPathname } from "../lib/navigation";

const useStyles = makeStyles((theme) => ({
  selectorLabel: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const MENU_ITEM_ATTRIBUTE = "data-language";

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

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
      window.location.assign(
        replaceLanguageInPathname(location.pathname, incomingSelection)
      );
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
            {t(`languageSelector.availableLanguageLabels.${i18n.language}`)}
          </span>
        </Hidden>
        <ExpandMore />
      </Button>
      <Paper>
        <Menu {...bindMenu(menuState)}>
          {Object.values(AvailableLanguage)
            .map((code) => {
              return {
                code,
                name: t(`languageSelector.availableLanguageLabels.${code}`),
              };
            })
            .sort((a, b) => {
              return a.name < b.name ? -1 : 1;
            })
            .map((lng, index) => {
              const dataProp = {
                [MENU_ITEM_ATTRIBUTE]: lng.code,
              };
              return (
                <MenuItem
                  key={`language-selector-${index}`}
                  onClick={handleItemClick}
                  selected={lng.code === i18n.language}
                  {...dataProp}
                >
                  {lng.name}
                </MenuItem>
              );
            })}
          <Divider />
          <MenuItem
            onClick={() => {
              window.open(CONTRIBUTE_TRANSLATIONS, "_blank");
            }}
          >
            {t(`languageSelector.contribute`)}
          </MenuItem>
        </Menu>
      </Paper>
    </div>
  );
}
