"use client";
import { Drawer } from "@/comps/Drawer";
import { useState } from "react";

export default function Page() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <div>
      <h1>Welcome to Next.js!</h1>
      <button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Drawer</button>
      <Drawer isOpen={isDrawerOpen}>
        <h5>This is the content of the drawer.</h5>
      </Drawer>
    </div>
  );
}
