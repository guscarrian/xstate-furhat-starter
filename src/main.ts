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

async function confusedGesture() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "confusedGesture",
      frames: [
        {
          time: [0.6], //This frame starts the gesture
          persist: true,
          params: {
            //Eyebrows
            BROW_UP_LEFT: 0.6,
            BROW_DOWN_RIGHT: 0.5,
            BROW_IN_LEFT: 0.4,
            BROW_IN_RIGHT: 0.4,

            //Eyes
            EYE_SQUINT_LEFT: 0.3,
            EYE_SQUINT_RIGHT: 0.3,
            LOOK_UP_LEFT: 0.2,
            LOOK_LEFT: 0.3,

            //Mouth
            SMILE_CLOSED: 0.1,
            SMILE_OPEN: 0.2,
            EXPR_SAD: 0.2,
            SURPRISE: 0.15,

            //Head
            NECK_TILT: 15.0,
            NECK_PAN: -5.0,
            GAZE_PAN: -5.0,
          },
        },
        {
          time: [2.5], //This frame holds the expression
          persist: true,
          params: {},
        },
        {
        time: [3.0], //This frame resets to neutral
        persist: false,
        params: {
          reset: true,
        },
      },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function omgGesture() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "omgGesture",
      frames: [
        {
          time: [0.6], //transition into OMG gesture
          persist: true,
          params: {
            //Eyebrows + eyes
            BROW_UP_LEFT: 0.9,
            BROW_UP_RIGHT: 0.9,
            EYE_SQUINT_LEFT: 0.0,
            EYE_SQUINT_RIGHT: 0.0,
            SURPRISE: 1.0,

            //Mouth
            PHONE_BIGAAH: 0.4,
            //PHONE_OOH_Q: 0.9,  //rounded lips
            SMILE_OPEN: 0.1,
            SMILE_CLOSED: 0.0,

            //Head
            NECK_TILT: -10.0,
            GAZE_TILT: -5.0,
          },
        },
        {
          time: [2.5], // holds expression
          persist: true,
          params: {},
        },
        {
          time: [4.0], //resets to neutral
          persist: false,
          params: {
            reset: true,
          },
        },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

// sadisappointed = sad + disappointed
async function sadisappointedGesture() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "sadisappointedGesture",
      frames: [
      {
        //Trying to make it pout
        time: [0.8],
        persist: true,
        params: {
          EXPR_SAD: 1.0,
          
          //Brows (together and down)
          BROW_IN_LEFT: 0.6,
          BROW_IN_RIGHT: 0.6,
          BROW_DOWN_LEFT: 0.8,
          BROW_DOWN_RIGHT: 0.8,
          
          //Eyes
          EYE_SQUINT_LEFT: 0.4,
          EYE_SQUINT_RIGHT: 0.4,

          //Mouth
          SMILE_CLOSED: 0.0,
          SMILE_OPEN: 0.0,
          PHONE_OOH_Q: 0.4, //slight rounded lips to make it pout
          PHONE_BIGAAH: 0.2,
          
          //Gaze and neck
          LOOK_DOWN: 0.8,
          NECK_TILT: 10.0,  //tilt down
          GAZE_TILT: 8.0,
        },
      },
      {
        //Holding the gesture for a bit to add emotional weight
        time: [2.0],
        persist: true,
        params: {},
      },
      {
        //Reset to neutral
        time: [2.8],
        persist: false,
        params: { reset: true },
      },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function fhGesture(text: string) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(
    `http://${FURHATURI}/furhat/gesture?name=${text}&blocking=true`,
    {
      method: "POST",
      headers: myHeaders,
      body: "",
    },
  );
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

const dmMachine = setup({
  actors: {
    fhVoice: fromPromise<any, null>(async () => {
      return fhVoice("en-US-EchoMultilingualNeural");
    }),
    fhHello: fromPromise<any, null>(async () => {
      return fhSay("Hiii! How's it go...");
    }),
    fhL: fromPromise<any, null>(async () => {
     return fhListen();
    }),
    //fhGesture: fromPromise<any, null>(async () => {
    //  return newGesture();
    //}),
    fhConfused: fromPromise<any, null>(async () => {
      return Promise.all([
        fhSay("Wait...! Where's the cinnamon bun I just left here?"),
        confusedGesture()
      ])
    }),
    fhOMG: fromPromise<any, null>(async () => {
      return Promise.all([
        fhSay("Oh. My. God. Did you eat it?"),
        omgGesture()
      ])
    }),
    fhSadisappointed: fromPromise<any, null>(async () => {
      return Promise.all([
        //fhSound(`https://github.com/guscarrian/xstate-furhat-starter/raw/refs/heads/lab3/src/sad_violin.wav`),
        fhSound(`https://raw.githubusercontent.com/guscarrian/xstate-furhat-starter/lab3/src/sad_violin.wav`),
        sadisappointedGesture()
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
  },
}).createMachine({
  id: "root",
  initial: "Start",
  states: {
    Start: { after: { 1000: "Next" } },
    Next: {
      invoke: {
        src: "fhHello",
        input: null,
        onDone: {
          target: "GetUser",
          actions: ({ event }) => console.log(event.output),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
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
          target: "Confused",
          actions: ({ event }) => console.log(event.output),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    Confused: {
      invoke: {
        src: "fhConfused",
        input: null,
        onDone: {
          target: "DramaticPause",
          actions: ({ event }) => console.log(event.output),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        }
      },
    },
    DramaticPause: {
      after: { 900: "OMG" },
    },
    OMG: {
      id: "OMG",
      invoke: {
        src: "fhOMG",
        input: null,
        onDone: {
          target: "Listen",
          actions: ({ event }) => console.log(event.output),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        }
      }
    },
    Listen: {
      id: "Listen",
      invoke: {
        src: "fhL",
        input: null,
        onDone: [
          {
            target: "SaDisappoined",
            actions: ({ event }) => console.log(event.output),
          }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 5000: "SaDisappoined" } 
    },
    SaDisappoined: {
      invoke: {
        src: "fhSadisappointed",
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
    Fail: {
      id: "Fail",
      invoke: {
        src: "fhTalk",
        input: "Something went wrong!",
        //input: null,
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
    End: {},
  },
});

const actor = createActor(dmMachine).start();
console.log(actor.getSnapshot().value);

actor.subscribe((snapshot) => {
  console.log(snapshot.value);
});

