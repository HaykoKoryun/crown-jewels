                                         -̆̆̆+-
                                      (͠ ͡ ^̆̆̆̆̆̆O^͡ ͠ )
                                       \##║##/
                                       [@-@-@]
                                       -------
                                 ~{---------------}~
# CROWN JEWELS
Store your _crown jewels_ (passwords) securely in a private `git` repository.

#### Usage
1. Install `npm i -g crown-jewels`
2. Create a file with your passwords, e.g. `deploy.pwd`
3. Run `crown-jewels hide --file deploy.pwd --key {key}` with a secure `{key}` (maximum 32 characters) to encrypt the file
4. Delete the original file (optional, but don't forgot to `git` __ignore__ it)
5. Commit the two generated files `deploy.cj` and `deploy.cjiv` (`cj` is the encrypted file, `cjiv` is an [initialisation vector](https://en.wikipedia.org/wiki/Initialization_vector))
6. Run `crown-jewels reveal --file deploy --key {key}` to decrypt the file (this will display the contents of the file for __180__ seconds and then automatically clear the command console)