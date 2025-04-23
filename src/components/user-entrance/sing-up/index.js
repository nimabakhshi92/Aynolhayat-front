import UserEntrance from "../../ui/layouts/user-entrance";
import Frame from "../../ui/layouts/user-entrance/frame";
import SingUpForm from "./sing-up-form";

export default function SingUp() {
  return (
    <UserEntrance>
      <Frame>
        <SingUpForm />
      </Frame>
    </UserEntrance>
  );
}
