import { FormEvent, ReactElement, createRef, useState } from "react";
import { Conversation, getXMTPConversation } from "@xmtp/models";
import Button from "../components/Button";
import { GroupChat } from "@xmtp/xmtp-js";
import { useClient } from "../hooks/useClient";

export default function GroupSettingsView({
  conversation,
  dismiss,
}: {
  conversation: Conversation;
  dismiss: () => void;
}): ReactElement {
  const client = useClient()!;
  const textField = createRef<HTMLInputElement>();

  const [title, setTitle] = useState<string | undefined>(conversation.title);
  const [newMemberAddress, setNewMemberAddress] = useState<string>("");

  function updateTitle(e: FormEvent) {
    e.preventDefault();

    if (!title) {
      return;
    }

    (async () => {
      const xmtpConversation = await getXMTPConversation(client, conversation);
      const groupChat = new GroupChat(client, xmtpConversation);

      await groupChat.changeTitle(title);
      dismiss();
    })();
  }

  function addMember(e: FormEvent) {
    e.preventDefault();

    if (!newMemberAddress) {
      return;
    }

    (async () => {
      const xmtpConversation = await getXMTPConversation(client, conversation);
      const groupChat = new GroupChat(client, xmtpConversation);

      await groupChat.addMember(newMemberAddress);
      dismiss();
    })();
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-2">Members</h3>
        <ul className="list-disc">
          {conversation.groupMembers!.map((member) => {
            return <li>{member}</li>;
          })}
        </ul>
      </div>

      <form className="space-y-2" onSubmit={updateTitle}>
        <div>
          <label className="space-y-2">
            <span className="block">Group Title</span>
            <input
              value={title || ""}
              onInput={(e: FormEvent<HTMLInputElement>) =>
                setTitle(e.currentTarget.value)
              }
              ref={textField}
              type="text"
              className="p-2 rounded border w-full md:w-1/2"
            />
          </label>
        </div>

        <Button
          type="submit"
          disabled={(title || "") === (conversation.title || "")}
        >
          Update Title
        </Button>
      </form>

      <form className="space-y-2" onSubmit={addMember}>
        <div>
          <label className="space-y-2">
            <span className="block">Add a Member</span>
            <input
              ref={textField}
              type="text"
              value={newMemberAddress}
              onChange={(e) => setNewMemberAddress(e.target.value)}
              className="p-2 rounded border w-full md:w-1/2"
            />
          </label>
        </div>
        <div>
          <Button type="submit" disabled={newMemberAddress.trim() == ""}>
            Add Member
          </Button>
        </div>
      </form>
    </div>
  );
}
