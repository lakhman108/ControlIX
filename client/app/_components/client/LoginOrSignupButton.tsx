import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginOrSignupButton = () => {
  return (
    <div className="">
      <Link className="mr-3" href="/signup">
        <Button>Signup</Button>
      </Link>

      <Link className="" href="/login">
        <Button className="btn-outline" variant={"outline"}>Login</Button>
      </Link>
    </div>
  );
};

export default LoginOrSignupButton;