## LAB 3: Social robotics - Report

### Part A:

For the first part of the lab, I created two new gestures; **confusedGesture** and **omgGesture**. The last gesture is intentionally dramatic as it is inspired by a [meme](https://tenor.com/view/reactions-gif-12900002073893207744) featuring Michael Scott, a fictional character from the *The Office* (U.S.). When designing the gestures, I used the list of parameters from the [Furhat Remote API documentation](https://docs.furhat.io/remote-api/#furhatgesture) and focused on each specific part that makes up the complete gesture, that is, eveybrows, eyes, mouth, neck, etc.

Next, I defined two functions, **fhGetUser** and **fhAttend**, to get and attend the user respectively. I initially only added the fhAttend function, which did not work since we also need to get the user first. This part was a bit challenging and the help of our TA Viktoria was crucial to get it right.

The reason why I chose to create the confused and OMG gestures was mainly because I wanted them to fit into the demonstration dialogue (part A3), which is described below. Similarly, I introduced a third gesture, **sadisappointedGesture**, that is perfomed together with an audio sound (dramatic piano). To handle the audio sound, the **fhSound** function was created. The sadisappointedGesture is the result of combining sadness and disappointment, which I believe is what we need in a situation like this:

Furhat > Hi! How's it going?
Furhat > Wait, where's the cinnamon bun I just left here? (*confused*)
Furhat > OMG! Did you eat it? (*OMG*)
User   > Whoopsies, I did... (imaginary user input)
Furhat > * Dramatic piano * (*sad/disappointed*)

The machine flow is as follows:
Start > Next > GetUser > Attend > Confused > DramaticPause > OMG > Listen > SaDisappointed > End

Note that, although the *Listen* state is fully functional, it is in fact not being used as intended since we do not really care for user input in this demonstration dialogue. It is simply kept to simulate the designed scenario.

Additionally, I created different actors (**fhAttend**, **fhGetUser**, **fhConfused**, **fhOMG**, **fhSadisappointed**, and **fhTalk**) to get and attend the user, handle each gesture and their corresponding scripted dialogue / audio sound. Some actors, including *fhHello* and *fhSay*, were reused to handle Furhat's speech. 


### Part B (option 2: intagrating Furhat with LLM-based dialogue system)

*Report coming soon*