import { setup, createActor, fromPromise, assign } from "xstate";

const FURHATURI = "127.0.0.1:54321";

async function fhVoice(name: string) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  const encName = encodeURIComponent(name);
  return fetch(`http://${FURHATURI}/furhat/voice?name=${encName}`, {
    method: "POST",
    headers: myHeaders,
    body: "",
  });
}

async function fhSay(text: string) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  const encText = encodeURIComponent(text);
  return fetch(`http://${FURHATURI}/furhat/say?text=${encText}&blocking=true`, {
    method: "POST",
    headers: myHeaders,
    body: "",
  });
}

async function fhAttend() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/attend?user=CLOSEST`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      enum: "CLOSEST",
    }),
  });
}

async function fhGetUser() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/users`, {
    method: "GET",
    headers: myHeaders
  });
}

async function fhSound(url: string) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  const encText = encodeURIComponent(url);
  return fetch(`http://${FURHATURI}/furhat/say?url=${encText}&blocking=true`, {
    method: "POST",
    headers: myHeaders,
    body: "",
  });
}

async function BigSmile() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "BigSmile",
      frames: [
      {
        time: [0.8],
        persist: true,
        params: {
          "BROW_UP_LEFT": 1,
          "BROW_UP_RIGHT": 1,
          "SMILE_OPEN": 0.4,
          "SMILE_CLOSED": 0.7
        }
      },
      {
        time:[0.96],
        persist: false,
        params: {
          "reset": true
        }
      }
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function Happy() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "Happy",
      frames: [
        {
          time: [0.5],
          persist: true,
          params: {
            "SMILE_OPEN": 0.6,
            "BROW_UP_LEFT": 0.8,
            "BROW_UP_RIGHT": 0.9,
          },
        },
        {
          time: [0.9],
          persist: false,
          params: { reset: true },
        },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}


async function GazeAway() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");

  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "GazeAway",
      frames: [
        {
          time: [0.2],
          params: {
            "GAZE_PAN": 20,  // look slightly to the right
            "GAZE_TILT": 5,  // a small upward tilt
          },
        },
        {
          time: [0.8],
          params: {
            "GAZE_PAN": 0,   // return to neutral
            "GAZE_TILT": 0,
          },
        },
        {
          time: [1.0],
          persist: false,
          params: { "reset": true },
        },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function DoubleNod() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "DoubleNod",
      frames: [
        { 
          time: [0.9], 
          persist: true, 
          params: {
            NECK_TILT: 10.0,  //tilt down
          }
        },
        {
          //Reset to neutral
          time: [1.0],
          persist: false,
          params: { reset: true },
        },
        { 
          time: [0.9], 
          persist: true, 
          params: {
            SMILE_CLOSED: 0.7,
            NECK_TILT: 8.0,  //tilt down
          }
        },
        {
          //Holding the gesture
          time: [0.6],
          persist: true,
          params: {},
        },
        {
          //Reset to neutral
          time: [1.0],
          persist: false,
          params: { reset: true },
        },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}


async function Kissing() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "Kissing",
      frames: [
        {
        time: [0.8],
        persist: true,
        params: {
          SMILE_CLOSED: 0.4,  // closes corners of mouth slightly (U shape)
          PHONE_B_M_P: 0.3,
          PHONE_W: 0.5,
          PHONE_OOH_Q: 1.0,
          BROW_UP_LEFT: 0.1,  // subtle facial liveliness
          BROW_UP_RIGHT: 0.1,
        },
      },
      {
          //Holding the gesture
          time: [1.0],
          persist: true,
          params: {},
        },
      // Back to neutral
      {
        time: [1.2],
        persist: false,
        params: {
          "reset": true,
        },
      },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}


async function fhListen() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/listen`, {
    method: "GET",
    headers: myHeaders,
  })
    .then((response) => response.body)
    .then((body) => body.getReader().read())
    .then((reader) => reader.value)
    .then((value) => JSON.parse(new TextDecoder().decode(value)).message);
}

// This function defines some stop words that the user may say when trying to end the conversation.
//Good to know: this function isn't async because guards must run synchronously.
// They're evaluated immediately when a transition is triggered, so they can't just
// wait for a Promise, otherwise the machine wouldn't know which path to take in time.
function shouldEndConversation(input: string): boolean {
  const stopWords = ["stop", "bye", "goodbye", "exit", "quit", "see you", "i have to go", "i actually have to go", 
    "i need to run", "i need to leave"];
  const normalized = input.toLowerCase();
  return stopWords.some(word => normalized.includes(word));
}

// This function selects a random gesture from the ones defined above
// so that Furhat can use a different one everytime it speaks the LLM response (fhLLMSpeak).
async function selectRandomGesture() {
  const gestures = [BigSmile, Happy, DoubleNod, GazeAway];
  const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
  console.log(randomGesture)
  randomGesture();
}


const dmMachine = setup({
  guards: {
    userWantsToEnd: ({ context }) => shouldEndConversation(context.userInput),
  },
  actors: {
    fhVoice: fromPromise<any, null>(async () => {
      return fhVoice("en-US-EchoMultilingualNeural");
    }),

    fhL: fromPromise<any, null>(async () => {
     return fhListen();
    }),

    fhKissing: fromPromise<any, null>(async () => {
      return Promise.all([
        fhSay("Puss puss"),        
        fhSound(`https://raw.githubusercontent.com/guscarrian/xstate-furhat-starter/lab3/src/kiss-sound-effect.wav`),
        Kissing()
      ])
    }),
    fhTalk: fromPromise<any, string>(async (input) => {
      return fhSay(input.input);
    }),
    fhAttend: fromPromise<any, null>(async () => {
      return fhAttend();
    }),
    fhGetUser: fromPromise<any, null>(async () => {
      return fhGetUser();
    }),

    LLMActor: fromPromise<any, { messages: { role: string; content: string }[] }>(
      async ({ input }) => {
        const body = {
          model: "llama3.1",
          stream: false,
          messages: input.messages, //entire conversation
        };

        const response = await fetch("http://localhost:11434/api/chat",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body : JSON.stringify(body),
        });

        const data = await response.json();
        return data.message?.content?.trim()
    }),

    fhLLMSpeak: fromPromise<any, string>(async ({ input }) => {
      selectRandomGesture(); //running a random gesture in parallel
      return fhSay(input);
    }),
  },
}).createMachine({
  id: "root",
  context: {
    userInput: "",
    llmResponse: "",
    intructionsLLM: "You are a conversation assistant and your job is to provide very brief chat-like responses.",
    messages: [], //to store the full chat history
  },
  initial: "Start",
  states: {
    Start: { after: { 1000: "GetUser" } },
    GetUser: {
      invoke: {
        src: "fhGetUser",
        input: null,
        onDone: {
          target: "Attend",
          actions: ({ event }) => console.log(event.output),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    Attend: {
      invoke: {
        src: "fhAttend", 
        input: null,
        onDone: {
          target: "Greeting",
          actions: ({ event }) => console.log(event.output),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    Greeting: {
      entry: assign({
        messages: ({ context }) => [
          { role: "system", 
            content: context.instructionsLLM
          },
          {
            role: "user",
            content: "Please, start the conversation with a friendly greeting. From now on, remember to keep your answers brief and concise."
          },
        ],
      }),
      invoke: {
        src: "LLMActor",
        input: ({ context }) => ({
          messages: context.messages, // sends system prompt only
        }),
        onDone: {
          target: "LLMSpeaks",
          actions: assign({
            llmResponse: ({ event }) => event.output,
            messages: ({ context, event }) => [
              ...context.messages, {
                role: "assistant",
                content: event.output
              },
            ], // Note: to avoid the request growing too large over time, we can cap the message history to the last 10 turns, for example --> ].slice(-10),
          }),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    Listen: {
      id: "Listen",
      invoke: {
        src: "fhL",
        input: null,
        onDone: {
          target: "TestLLM",
          actions: assign({
            userInput: ({ event }) => event.output,
            messages: ({ context, event }) => [
              ...context.messages, {
                role: "user", 
                content: event.output 
              },
            ], //].slice(-10),
          }),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    TestLLM: {
      invoke: {
        src: "LLMActor",
        input: ({ context }) => ({
          messages: context.messages,
        }),
        onDone: [
          {
            guard: "userWantsToEnd",
            target: "Goodbye",
            actions: assign({
              userInput: ({ event }) => event.output,
            }),
          },
          {
          target: "LLMSpeaks",
          actions: assign({
            llmResponse: ({ event }) => event.output,
            messages: ({ context, event }) => [
              ...context.messages, {
                role: "assistant",
                content: event.output
              },
            ], //].slice(-10),
          }),
          }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    LLMSpeaks: {
      invoke: {
        src: "fhLLMSpeak",
        input: ({ context }) => context.llmResponse,
        onDone: {
          target: "Listen",
          actions: ({ event }) => {console.log("LLM says:", event.output)},
          //actions: ({ event }) => event.output,
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        }
      }
    },
    Fail: {
      id: "Fail",
      invoke: {
        src: "fhTalk",
        input: "Something went wrong!",
        onDone: {
          target: "Listen",
          actions: ({ event }) => console.log(event.output),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    Goodbye: {
      invoke: {
        src: "fhLLMSpeak",
        input: "Alright! I had a great time talking to you. Come back anytime! Bye!",
        onDone: {
          target: "Kiss",
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    Kiss: {
      invoke: {
        src: "fhKissing",
        input: null,
        onDone: [
          {
            target: "End",
            actions: ({ event }) => console.log(event.output),
          }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      }
    },
    End: {
      entry: ({ event }) => console.log("End of the conversation", event.output),
      type: "final",
    },
  },
});

const actor = createActor(dmMachine).start();
console.log(actor.getSnapshot().value);

actor.subscribe((snapshot) => {
  console.log(snapshot.value);
});

