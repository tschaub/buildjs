JavaScript Library Builder
==========================

Hosted build service for JavaScript libraries.

http://buildjs.opengeo.org/

## Setup ##

Note that these setup steps are subject to change.

### Prerequisites ###

BuildJS is meant to run on App Engine.  To run it locally, you must have a copy of the App Engine Java SDK installed locally.  Download the latest App Engine SDK for Java from the [App Engine downloads page](http://code.google.com/appengine/downloads.html).

To pull in the necessary dependencies, you also need Ant installed.  Download and install the latest from the [Ant downloads page](http://ant.apache.org/bindownload.cgi).

Finally, the `build.xml` configuration file needs to know the path to your App Engine Java SDK.  You can configure this by setting the `APPENGINE_JAVA_SDK` environment variable.

    $ APPENGINE_JAVA_SDK=/path/to/appengine-java-sdk

Alternatively, you can edit `build.xml` to include the relative path to the SDK.

### Pulling in the Project Sources ###

The application can be used to build different versions of different projects.  Currently, you have to manually download the project sources that you want to build.  By placing these project sources in a `projects` directory, they will be made available to the build service.  The convention is to organize projects by name and then version (e.g. `projects/geoext/0.7`).

This step is not well documented and it should go away soon.

### Running the Development Server ###

The App Engine SDK comes with a development server that mimics the conditions of the hosted server.  You can run the local development server with the `runserver` Ant task.

    $ ant runserver

The first time you do this, the necessary dependencies will be pulled in.  Each subsequent time, the sources for those dependencies will be updated if they have changed.

### Updating the Hosted Service ###

After you have tested the service locally by running the development server, you can upload it to AppSpot.  In order to do this, you need to be listed as a contributor to the project.  Once you are a contributor, you can run the `update` Ant task to upload the application.

    $ ant update

If you have not recently established your credentials on AppSpot, you need to first run the `appcfg.sh` script that comes with the App Engine SDK.

    $ /path/to/appengine-java-sdk/bin/appcfg.sh update build
