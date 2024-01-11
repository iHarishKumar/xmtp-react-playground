import { FormEvent, ReactElement, createRef } from "react";
import { useClient } from "../hooks/useClient";
import Button from "../components/Button";

export default function BroadcastMessages(): ReactElement {
  const client = useClient();
  const textField = createRef<HTMLInputElement>();

  async function broadcastMessage(e: FormEvent) {
    e.preventDefault();

    console.log("starting to boradcast")

    const broadcasts_array: string[] | undefined =
      textField.current?.value.split(",");
    console.log("array for broadcasting ----", broadcasts_array, client);

    if (!broadcasts_array) {
      return;
    }

    //Querying the activation status of the wallets
    const broadcasts_canMessage = await client!.canMessage(broadcasts_array!);
    for (let i = 0; i < broadcasts_array!.length; i++) {
      //Checking the activation status of each wallet
      const wallet = broadcasts_array![i];
      if (broadcasts_canMessage[i]) {
        const conversation = await client!.conversations.newConversation(
          wallet
        );
        // Send a message
        const sent = await conversation.send("This is a test message 1");
      }
    }
  }
  return (
    <div>

      <form className="d-block flex space-x-2" onSubmit={broadcastMessage}>
        <input
          autoFocus
          className="p-2 border rounded flex-grow w-96 text-xs dark:text-black"
          ref={textField}
          type="text"
          placeholder={"Provide addresses to broadcast messages!"}
        />

        <Button type="submit" color="primary" size="sm">
          Click me to broadcast message!
        </Button>
      </form>
    </div>
  );
}
