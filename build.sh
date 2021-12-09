#!/bin/bash

pip install -r requirements.txt
rm -rf dist build
pip uninstall jupyterthemes -y
python3 setup.py bdist_wheel
pip install dist/jupyterthemes-0.20.0-py2.py3-none-any.whl
jt -t airtd -cellw 90% -N -T --logo airt-neg-trans.png --fav_icon_dir custom-fav-icons
