#!/bin/bash
rm -f cybercat-insurance.zip
mkdir cybercat-insurance

cp -r bower_components images lib models music src index.html cybercat.nfo cybercat-insurance

zip cybercat-insurance.zip -9 -r cybercat-insurance

rm -rf cybercat-insurance/