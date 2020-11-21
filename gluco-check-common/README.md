# gluco-check-common

This package contains all translatable strings.  
It is automatically updated by Crowdin, so don't translate the yaml files directly.

## IMPORTANT
To speed up cold starts, other packages don't use the YAML files.
Instead they use JSON files with the same name.

Don't forget to 'build' this package after updating translations!
(If you have git hooks enabled, husky will do this for you post merge)
