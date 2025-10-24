## LAB 3: Social robotics - Report

### Part A:

**Note**: Part A is implemented entirely within the file *main.ts*.

For the first part of the lab, I created two new gestures; **confusedGesture** and **omgGesture**. The last gesture is intentionally dramatic as it is inspired by a [meme](https://tenor.com/view/reactions-gif-12900002073893207744) featuring Michael Scott, a fictional character from the *The Office* (U.S.). When designing the gestures, I used the list of parameters from the [Furhat Remote API documentation](https://docs.furhat.io/remote-api/#furhatgesture) and focused on each specific part that makes up the complete gesture, that is, eveybrows, eyes, mouth, neck, etc.

Next, I defined two functions, **fhGetUser** and **fhAttend**, to get and attend the user respectively. I initially only added the fhAttend function, which did not work since we also need to get the user first. This part was a bit challenging and the help of our TA Viktoria was crucial to get it right.

The reason why I chose to create the confused and OMG gestures was mainly because I wanted them to fit into the demonstration dialogue (part A3), which is described below. Similarly, I introduced a third gesture, **sadisappointedGesture**, that is perfomed together with an audio sound (sad violin). To handle the audio sound, the **fhSound** function was created. The *sadisappointedGesture* is the result of combining sadness and disappointment, which I believe is what we need in a situation like this:

Furhat > Hi! How's it going?<br>
Furhat > Wait, where's the cinnamon bun I just left here? (*confused*)<br>
Furhat > OMG! Did you eat it? (*OMG*)<br>
User   > Whoopsies, I did... (imaginary user input)<br>
Furhat > * Sad violin * (*sad/disappointed*)<br>

The machine flow is as follows:
Start > Next > GetUser > Attend > Confused > DramaticPause > OMG > Listen > SaDisappointed > End

Note that, although the *Listen* state is fully functional, it is in fact not being used as intended since we do not really care for user input in this demonstration dialogue. It is simply kept to simulate the designed scenario.

Additionally, I created different actors (**fhAttend**, **fhGetUser**, **fhConfused**, **fhOMG**, **fhSadisappointed**, and **fhTalk**) to get and attend the user, handle each gesture and their corresponding scripted dialogue / audio sound. Some actors, including *fhHello* and *fhSay*, were reused to handle Furhat's speech. 


### Part B (option 2: intagrating Furhat with LLM-based dialogue system)

**Note**: The logic for Part B (Option 2) is contained within *main_vg.ts*.

The reason to create a new file for part B is because the demonstration dialogue along with the gestures that I initially designed for part A made no sense when implementing the LLM. That is why I decided to reuse as much as possible from *main.ts* but adding what was necessary to cover part B. That is, while we keep the functions and actors for getting, attending and listening to the user, there are also new gestures, functions, states, etc. 

**New gestures:**
- BigSmile
- Happy
- DoubleNod
- GazeAway
- Kissing

Since the LLM's exact response is unpredictable, I chose to use dynamic gestures that adapt appropriately to any output. That's why I incorporated the first four gestures on the list above to go with any LLM response without getting an odd result. 

**New functions:**

- To make the gestures dynamic, I created a function (**selectRandomGesture**) that selects a random gesture so that Furhat can use a different one everytime it speaks the LLM response (*fhLLMSpeak*).

- **shouldEndConversation** defines some stop words that the user may say when trying to end the conversation ("goodbye", "exit", "quit", "see you", "I have to go", etc.). This function is called by the newly added **userWantsToEnd** guard that handles 
this situation.

**New actors:**

- This implementation allows to invoke an LLM handled by **LLMActor** and **fhLLMSpeak**. The latest is responsible for speaking the LLM response together with a random gesture (*BigSmile*, *Happy*, *DoubleNod*, *GazeAway* or *Kissing*).

- The **fhKissing** actor attempts to simulate a kissing gesture (which is triggered in the **Kiss** state) by making Furhat say "puss puss", closing thr corners of its mouth slighly (U shape) and playing a kiss sound effect[^1]. 

**States:**

For this part, the machine flow looks like this:

Start > GetUser > Attend > Greeting > (LLMSpeaks > Listen > TestLLM)* > Goodbye > Kiss > End

*LLMSpeaks > Listen > TestLLM is a loop that handles the LLM reponse, getting the user input and passing it to the LLM model to then generate another response. The loops ends when the user mentions a word/phrase from the list of stop words defined in *shouldEndConversation*.

A possible *Furhat - User* interaction could go as follows:

Furhat > Hi! How's your day going?<br>
User > Hi there! It's going great. How are you?<br>
Furhat > I'm doing fine. Do you have any intresting plan for today?  (*BigSmile gesture*)<br>
User > I was actually thinking about baking a cake, yeah...<br>
Furhat > Wow, that sounds delicious! What kind of cake do you have in mind? (*Happy gesture*)<br>
[...]<br>
User  > I actually need to run now...<br>
Furhat > Alright! I had a great time talking to you. Come back anytime! Bye! (*DoubleNod gesture*)<br>
Furhat > Puss puss (* kissing gesture + kiss sound effect*)<br>


[^1]: Sound effect by [beetpro](https://pixabay.com/users/beetpro-16097074/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=11100) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=11100).