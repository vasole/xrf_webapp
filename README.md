# xrf_webapp
Web application for XRF

Dependency:
- bottle (`pip install bottle`)


## How to run it ?
You can find an instance of [this server running](http://fisxserver.esrf.fr) or start your own local copy:


`python app.py`

Then go to `http://localhost:8099`, clicking on `Submit` will send a request to the server,
code will be executed in `do_calculation` function in `app.py`. The return from this function
is displayed at the bottom of the web page.

See source code for more doc ;)
