import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserRow } from "../../ui/components/UserRow";
import { createUser } from "../../src/user";

const admin = createUser({ id: "u-admin", name: "Ada", email: "ada@example.com", role: "admin", status: "active" });
const viewer = createUser({ id: "u-viewer", name: "Bob", email: "bob@example.com", role: "viewer", status: "active" });
const target = createUser({ id: "u-target", name: "Carol", email: "carol@example.com", role: "editor", status: "pending" });

describe("UserRow", () => {
  it("renders user name and email", () => {
    render(<table><tbody><UserRow user={target} actor={admin} onEdit={() => {}} /></tbody></table>);
    expect(screen.getByText("Carol")).toBeInTheDocument();
    expect(screen.getByText("carol@example.com")).toBeInTheDocument();
  });

  it("shows Edit button when actor can write users", () => {
    render(<table><tbody><UserRow user={target} actor={admin} onEdit={() => {}} /></tbody></table>);
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("hides Edit button when actor cannot write users", () => {
    render(<table><tbody><UserRow user={target} actor={viewer} onEdit={() => {}} /></tbody></table>);
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("calls onEdit with the correct user when clicked", () => {
    const onEdit = jest.fn();
    render(<table><tbody><UserRow user={target} actor={admin} onEdit={onEdit} /></tbody></table>);
    fireEvent.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalledWith(target);
  });

  it("renders role badge and status dot", () => {
    render(<table><tbody><UserRow user={target} actor={admin} onEdit={() => {}} /></tbody></table>);
    expect(screen.getByText("Editor")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});
