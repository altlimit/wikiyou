#!/bin/bash

mkdir bin
cd bin
wget https://github.com/altlimit/sitegen/releases/download/v0.0.7/linux.zip
unzip linux.zip
cd ..
bin/sitegen -minify
