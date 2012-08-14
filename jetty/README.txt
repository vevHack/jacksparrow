This dir contains two files and two dirs:

These two config files are for 2 different server instances running on different ports

say 8090 and 8091 

Steps :

1. Download jetty 6.1.26 zip file from codehaus. The extracted folder will be now jetty home 
2. First of all generate war file from intellij idea from jetty-exploded-run option
3. Keep this war file in webapps dir in jetty home . Additionally extract this dir in the webapps.
4. Keep both the config files in etc dir inside jetty home.
5. keep both the context dir in the jetty home directly.
6. Now cd to the home folder from the terminal and then run the following command to start both the instances.

$ java -jar start.jar <file1.xml> <file2.xml>

and then these servers can be accessed on their respective ports .... they will be running on the same jvm

