#!/bin/bash

###
# Copyright 2025 SpinalCom - www.spinalcom.com
#
# This file is part of SpinalCore.
#
# Please read all of the following terms and conditions
# of the Software license Agreement ("Agreement")
# carefully.
#
# This Agreement is a legally binding contract between
# the Licensee (as defined below) and SpinalCom that
# sets forth the terms and conditions that govern your
# use of the Program. By installing and/or using the
# Program, you agree to abide by all the terms and
# conditions stated or referenced herein.
#
# If you do not agree to abide by these terms and
# conditions, do not demonstrate your acceptance and do
# not install or use the Program.
# You should have received a copy of the license along
# with this file. If not, see
# <http://resources.spinalcom.com/licenses.pdf>.
###

# This script copies all config_template.json5 files from the micro-apps directory
# to the configs directory, renaming them to the parent folder name.
# It uses a depth of 2 to find the files, meaning it will look for files in the
# micro-apps directory and one level deeper (e.g., micro-apps/app1/config_template.json5).
# Usage: ./copy_template.sh

cd "$(dirname "$0")" || exit

# Set the depth from the argument
DEPTH=2
# Set the name of the config file to search for
CONFIG_FILE_NAME="config_template.jsonc"
# output directory
OUTPUT_DIR_TEMPLATE="static/configs"

TYPECONV_PATH="./node_modules/.bin/typeconv"

# Create the target 'configs' directory if it doesn't exist
mkdir -p "$OUTPUT_DIR_TEMPLATE"

# List micro-apps folders and process each folder
for folder in micro-apps/*/; do
  # Get the folder name
  folder_name=$(basename "$folder")

  # Check if the folder contains a config_template.jsonc file
  if [[ -f "$folder/$CONFIG_FILE_NAME" ]]; then
    echo "Found $CONFIG_FILE_NAME in $folder_name"
    # Copy the config_template.jsonc file to the 'configs' folder with the parent folder name
    cp "$folder/$CONFIG_FILE_NAME" "$OUTPUT_DIR_TEMPLATE/${folder_name}.jsonc"
  fi

  # Find IConfig.ts file in the folder
  iconfig_file=$(find "$folder" -maxdepth 4 -type f -name "IConfig.ts")

  if [[ -n "$iconfig_file" ]]; then
    echo "Found IConfig.ts in $folder_name"

    # Convert IConfig.ts to JSON using typeconv
    "$TYPECONV_PATH" -f ts -t jsc -o "$OUTPUT_DIR_TEMPLATE" "$iconfig_file"
    # Rename the output file to match the folder name
    output_file="${OUTPUT_DIR_TEMPLATE}/$(basename "$iconfig_file" .ts).json"
    mv "$output_file" "$OUTPUT_DIR_TEMPLATE/${folder_name}_jsc.json"
  fi
done
