#!/bin/bash

mkdir bin
wget https://github.com/altlimit/sitegen/releases/download/v0.0.7/linux.zip
unzip linux.zip
bin/sitegen -minify
