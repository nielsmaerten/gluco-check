# gluco-check-action
This is the definition for the Action "Gluco Check" on Google Assistant. 

Install the `gactions` cli to work on them:  
https://developers.google.com/assistant/conversational/df-asdk/actions-sdk/gactions-cli

## Working on the Action
In most cases, you won't work on these files directly. Instead, you'll use the Action Builder:  
https://console.actions.google.com  

## Getting the latest version
```sh
cd ./definitions
gactions pull --clean --force
# --clean removes all extraneous files
# --force overwrites existing files
```

## Deploying to Google Assistant
```sh
cd ./definitions
gactions push [-v]
gactions deploy preview
# From here, you can submit the action for approval to get it in Production
```