<div style="background-color:#2d2e28;text-align:center;padding:10px;"><img src='misc/banner.png'/></div>  

## CROWN JEWELS
Store your _crown jewels_ (passwords) securely in a private `git` repository.


#### Encrypt
1. Install `npm i -g crown-jewels`
2. Create a file with your passwords, e.g. `deploy.pwd`
3. Run `crown-jewels store deploy.pwd`
4. Supply an encryption key in the following prompt (maximum 32 characters)
5. Delete the original file (recommended, however don't forgot to `git` __ignore__ it if you don't delete it)
6. Commit the two generated files `deploy.cj` and `deploy.cjiv` (`cj` is the encrypted file, `cjiv` is an [initialisation vector](https://en.wikipedia.org/wiki/Initialization_vector))

#### Decrypt
1. Run `crown-jewels reveal deploy` to decrypt the file `deploy.cj` file
2. Supply the same encryption key as before in the following prompt
3. If the key is correct, the command will display the contents of the file for __180__ seconds and then automatically clear the command console

#### Note
If you don't want to play along with names for the two commands `store` and `reveal` you can use their short aliases `e` (encrypt) and `d` (decrypt).