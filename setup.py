#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys

try:
    from setuptools import setup, find_packages
except ImportError:
    from distutils.core import setup

# This section installs the jupyter-pip if not installed
try:
    from jupyterpip import cmdclass
except:
    import pip, importlib

    pip.main(['install', 'jupyter-pip']);
    cmdclass = importlib.import_module('jupyterpip').cmdclass

readme = open('README.md').read()
history = open('HISTORY.rst').read().replace('.. :changelog:', '')

setup(
    name='CesiumWidget',
    version='0.1.0',
    description='IPython widget for Cesium world globe',
    long_description=readme + '\n\n' + history,
    author='Petrus Hyvonen',
    author_email='petrus.hyvonen@gmail.com',
    url='https://github.com/petrushy/CesiumWidget',
    packages=['CesiumWidget'],  # find_packages(exclude=('tests', 'docs')),
    install_requires=["jupyter-pip"],
    cmdclass=cmdclass('CesiumWidget'),
    include_package_data=True,
    license="Apache",
    zip_safe=False,
    keywords='CesiumWidget ipython',
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Natural Language :: English',
        "Programming Language :: Python :: 2",
        'Programming Language :: Python :: 2.6',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4'
    ]
)

