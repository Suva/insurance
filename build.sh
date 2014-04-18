#!/bin/bash
rm -f cybercat-insurance.zip
mkdir cybercat-insurance

cp -r bower_components images lib models music src index.html cybercat-insurance

zip cybercat-insurance.zip -r cybercat-insurance

rm -rf cybercat-insurance/