import React, { useRef } from "react";
import { Button } from "./Button";

export function HowToPlay() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <div className="">
      <Button kind="text" onClick={() => ref.current?.showModal()}>
        How To Play
      </Button>
      <dialog
        ref={ref}
        className="rounded-md shadow-lg shadow-gray-900/50 bg-white animate-grow-in w-full max-w-sm overflow-hidden h-full max-h-[100%-16rem] p-0"
        onClick={() => ref.current?.close()}
      >
        <Button
          color="danger"
          kind="flat"
          className="absolute top-0 right-0 rounded-none rounded-bl-md"
          title="Close [Esc]"
        >
          ✕
        </Button>
        <div
          className="flex flex-col gap-2 p-6 text-gray-800 h-full w-full overflow-auto"
          /* prevent clicks inside from closing */
          onClick={(event) => event.stopPropagation()}
        >
          <section>
            <h1 className="text-2xl font-bold">BounceBots</h1>
          </section>

          <section>
            <h2 className="text-lg font-bold">How to play</h2>
            <p className="text-sm mb-2">
              You play by moving the robots (the four colored circles) around
              the board. A robot moves by going in one direction as far as it
              can until it runs into a wall or another robot.
            </p>
            <p className="text-sm mb-2">
              The colored square on the board is the target. Your goal is to get
              the robot of the matching color to that target square while making
              as few moves as possible.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">Playing With Others</h2>
            <p className="text-sm mb-2">
              Gather round so that everyone can see the board, whether that's
              around a physical screen or by sharing a screen over a video call.
            </p>
            <p className="text-sm mb-2">
              The first player to see a solution calls out the number of moves
              their solution takes; this is their "bid". When this happens, flip
              the hourglass over to start the timer. Now, all the players, even
              the one that just bid, have until the timer runs out to get their
              bids in. Any player can always make a new bid <i>lower</i> than
              their previous bid, but a player can never raise their own bid.
            </p>
            <p className="text-sm mb-2">
              When the timer runs out, bidding is over. The player who first bid
              the lowest number of moves shows their solution to the others. If
              their solution is correct and uses the number of moves that they
              said, they are the winner of the round and the round is over. If
              they cannot demonstrate a solution in the number of moves that
              they bid, the player with the next-best bid attempts to show their
              solution. This continues until someone has shown a correct
              solution.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold">Playing Solo</h2>
            <p className="text-sm mb-2">
              See how optimal of a solution you can get by trying to minimize
              the number of moves you use.
            </p>
            <p className="text-sm mb-2">
              Use the timer for more exciting gameplay, or play at your own pace
              for a relaxing puzzle-solving experience.
            </p>
          </section>
          <section>
            <Button
              className="float-right"
              onClick={() => ref.current?.close()}
            >
              Close
            </Button>
          </section>
        </div>
      </dialog>
    </div>
  );
}
