import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useState } from "react";
import SignInForm from "../SignInForm";
import SignUpForm from "../SignUpForm";

export default function LoginBox() {
  const [modo, setModo] = useState(true);

  return (
    <Card className="w-5/12 h-auto">
      <CardHeader className="text-center">
        <h1>Bem vindo ao Website de skills</h1>
      </CardHeader>
      <CardContent>
        {modo ? <SignInForm /> : <SignUpForm setModo={setModo} />}
      </CardContent>
      <CardFooter className="flex justify-end">
        <h3
          className="cursor-pointer font-medium text-blue-600 underline hover:no-underline"
          onClick={() => {
            setModo(!modo);
          }}
        >
          Deseja criar uma conta?
        </h3>
      </CardFooter>
    </Card>
  );
}
