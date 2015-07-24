# Pearl: iOS Client

iOS app for your personal assistant to your health.

## About

PearlClient is the code repository for Pearl's iOS app. Inspired by apps such as [Lark](TODO: Future Link Here), PearlClient wants to bring friendly and intelligent health assistance with an open source community.

You can find out more about [Pearl at our homepage](https://www.openpearl.org).

Pearl is developed at [Involution Studios](https://www.goinvo.com/) in [Arlington, MA](TODO: Google Maps).

## For Developers

### Setup

* Make sure you have [XCode](TODO: Link to XCode) and [Node.JS](https://www.nodejs.org). 

* Install Ionic in the [following instructions](https://www.youtube.com/watch?v=1RQCjwnlTRk).

* Install all dependencies using `npm install` and `bower install`.

* Run the app in the emulator using `ionic emulate ios`.

  * Additional details can be found at the [Ionic Framework documentation](TODO: Link to Ionic install).

### Fun Facts

* PearlClient is developed using Ionic, a framework built on top of Angular for Cordova native application experiences.

* Most (if not all) of Pearl's intelligence is within our servers. The client applications only communicate and display data to the user in a friendly manner.

  * Keeping to a centralized "brain" helps us introduce new devices, such as Android and Echo, in a fast and decoupled way.