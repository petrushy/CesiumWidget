FROM andrewosh/binder-base

# no root stuff to do!
USER main

# install demo support
RUN conda install \
    ipywidgets \
    numpy \
  && pip install \
    czml \
    geocoder

# TODO: change this to `petrushy`
RUN git clone https://github.com/bollwyvl/CesiumWidget.git --depth=1

WORKDIR CesiumWidget

RUN python setup.py install
# jupyter-pip so crazy. this is cheating, as a real user wouldn't have
# the source checked out...
RUN jupyter nbextension install CesiumWidget --user --quiet
