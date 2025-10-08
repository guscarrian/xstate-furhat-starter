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

//async function newGesture() {
//  const myHeaders = new Headers();
//  myHeaders.append("accept", "application/json");
//  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
//    method: "POST",
//    headers: myHeaders,
//    body: JSON.stringify({
//      name: "newGesture",
//      frames: [
//        {
//          time: [], //ADD THE TIME FRAME OF YOUR LIKING
//          persist: true,
//          params: {
//            //ADD PARAMETERS HERE IN ORDER TO CREATE A GESTURE
//           
//          },
//        },
//        {
//          time: [], //ADD TIME FRAME IN WHICH YOUR GESTURE RESETS
//          persist: true,
//          params: {
//            reset: true,
//          },
//        },
//        //ADD MORE TIME FRAMES IF YOUR GESTURE REQUIRES THEM
//      ],
//      class: "furhatos.gestures.Gesture",
//    }),
//  });
//}

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
          time: [1.5], //This frame holds the expression
          persist: true,
          params: {},
        },
        {
        time: [2.0], //This frame resets to neutral
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
            PHONE_OOH_Q: 0.9,  //rounded lips
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
          time: [3.0], //resets to neutral
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
      return fhSay("Hi");
    }),
    fhL: fromPromise<any, null>(async () => {
     return fhListen();
    }),
    //fhGesture: fromPromise<any, null>(async () => {
    //  return newGesture();
    //}),
    fhConfused: fromPromise<any, null>(async () => {
      return confusedGesture();
    }),
    fhOMG: fromPromise<any, null>(async () => {
      return omgGesture();
    }),
    fhTalk: fromPromise<any, null>(async (input) => {
      return fhSay(input.input);
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
          target: "Listen",
          actions: ({ event }) => console.log(event.output),
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
        onDone: [
          {
            target: "OMGState",
            actions: ({ event }) => console.log("Listen: " + event.output),
          }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      }
    },
    OMGState: {
      id: "OMGState",
      invoke: {
        //src: "fhConfused",
        src: "fhOMG",
        input: null,
        onDone: {
          target: "End",
          //target: "#Listen",
          actions: ({ event }) => console.log("OMGState: " + event.output),
        },
        onError: {
          target: "#Fail",
          actions: ({ event }) => console.error(event),
        }
      }
    },
    Fail: {
      id: "Fail",
      invoke: {
        src: "fhTalk",
        //input: "Something's failing, whoopsies",
        input: null,
        onDone: {
          target: "#Listen",
          actions: ({ event }) => console.log("Fail: " + event.output),
        },
        onError: {
          target: "#Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    End: {
      id: "End",
      invoke: {
        src: "fhTalk",
        input: "This is the end of the interaction. Bye!",
        onError: {
          target: "#Fail",
          actions: ({ event }) => console.error(event),
        },
      }
    },
  },
});

const actor = createActor(dmMachine).start();
console.log(actor.getSnapshot().value);

actor.subscribe((snapshot) => {
  console.log(snapshot.value);
});

