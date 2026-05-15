"use client";

import * as React from "react";

export function Dialog({ children, ...props }: any) {
  return <div {...props}>{children}</div>;
}

export function DialogTrigger(props: any) {
  return <button {...props} />;
}

export function DialogContent({ children, ...props }: any) {
  return <div {...props}>{children}</div>;
}

export function DialogHeader({ children, ...props }: any) {
  return <div {...props}>{children}</div>;
}

export function DialogTitle(props: any) {
  return <h2 {...props} />;
}

export function DialogDescription(props: any) {
  return <p {...props} />;
}

export function DialogFooter({ children, ...props }: any) {
  return <div {...props}>{children}</div>;
}

export function DialogClose(props: any) {
  return <button {...props} />;
}
