"use client"
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { SignOutButton } from "@clerk/nextjs"


export default function Home() {
  return (
    <div>
        <h1 >hey yooo Homepage</h1>

        <SignedOut>
          <SignInButton/>
        </SignedOut>

      <SignedIn>
      <SignOutButton/>
      </SignedIn>

    </div>
  );
}
