# Tessellated Security
Tessellated Security is an end-to-end service to take your own tessel 2 and a magnetic switch and build your own security system. Check out the main [Github repo here](https://github.com/EnshaednHiker/tessellated-security) for a detailed tutorial on how to use the service. 

For the DYI security afficionado, all inclusive code to run a server (Node/Express), webclient, database (MongoDB/Mongoose), and a [tessel](https://tessel.io/) hooked up to a [magnetic door switch](https://www.sparkfun.com/products/13247).The project's server running here is hosted on Heroku while the database is on mLab.

## Webclient
[Live website for the service.](https://enshaednhiker.github.io/tessellated-security-webclient/) [Github Repo for the client website used to sign up for the service.](https://github.com/EnshaednHiker/tessellated-security-webclient) I used webpack and director as the two chief technologies to make this site. The website is hosted here on Github via GH-pages.

## Set up an account on the web client and add a device to your account

1. Go to the [website](https://enshaednhiker.github.io/tessellated-security-webclient/)
2. Click on "Register" in the nav bar
3. Fill in information to add an account. The email you put in will be the email that you will receive alerts through. The email can be changed later if you wish.
4. Add a device to your account. Give it a name that will be meaningful for the alert you receive. For instance, if you gave your device the name "back door," the alert you'll receive from that device will be "Alert: the back door opened."
5. Copy the token that gets generated by the site. This token is used later in setting up code on the tessel.

Note: say you add a device your account in the website, set up a tessel with that generated token, and then install a token on a door. If you delete your device in your accout, that will render that device useless, and you'll need to add a new device your account, push code again to the tessel with the newly generated token, and then reinstall the token on your door.

Watch the video from 0:00 to 2:30 for a comprehensive walkthrough on using the website.

## Video Tutorial and Demo of the the system in action

<a href="http://www.youtube.com/watch?feature=player_embedded&v=IHuYJmVRc1I
" target="_blank"><img src="http://img.youtube.com/vi/IHuYJmVRc1I/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

1. 0:00-2:30 shows how to use the website
2. 2:31-3:20 shows how to assemble the tessel
3. 3:21-5:26 shows how to put the code onto the tessel with the command line commands via npm
4. 5:27-6:38 shows a basic demo of the device working

## License

[MIT](http://vjpr.mit-license.org)
