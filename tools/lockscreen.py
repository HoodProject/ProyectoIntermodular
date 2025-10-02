"""Simple full-screen lock screen for cyber-café stations.

This script displays a full-screen Tkinter window that prevents closing
without entering the correct unlock code. The code can be supplied via
an environment variable, command line argument, or defaults to a safe
placeholder value that should be overridden in production.
"""
from __future__ import annotations

import argparse
import os
import sys
import tkinter as tk
from tkinter import messagebox


DEFAULT_CODE = "1234"
DEFAULT_MESSAGE = (
    "Estación bloqueada\n"
    "Solicite al encargado que introduzca el código de desbloqueo."
)


class LockScreen:
    """Full-screen Tkinter lock screen that requires an unlock code."""

    def __init__(self, unlock_code: str, lock_message: str, show_cursor: bool = False) -> None:
        self.unlock_code = unlock_code
        self.lock_message = lock_message
        self.show_cursor = show_cursor
        self.root = tk.Tk()
        self._configure_window()
        self._build_layout()

    def _configure_window(self) -> None:
        self.root.title("Estación bloqueada")
        self.root.attributes("-fullscreen", True)
        self.root.configure(bg="#0b1d2a")
        if not self.show_cursor:
            self.root.config(cursor="none")

        # Prevent closing the window with common shortcuts or window controls.
        self.root.protocol("WM_DELETE_WINDOW", self._block_event)
        for sequence in ("<Alt-F4>", "<Control-w>", "<Escape>", "<F11>"):
            self.root.bind(sequence, self._keep_fullscreen)

        # Re-assert fullscreen status if the window loses it for any reason.
        self.root.bind("<FocusOut>", self._restore_focus)
        self.root.after(1000, self._enforce_fullscreen)

    def _build_layout(self) -> None:
        container = tk.Frame(self.root, bg="#0b1d2a")
        container.pack(expand=True)

        title = tk.Label(
            container,
            text="Acceso restringido",
            font=("Arial", 36, "bold"),
            fg="#ffffff",
            bg="#0b1d2a",
        )
        title.pack(pady=(0, 20))

        message = tk.Label(
            container,
            text=self.lock_message,
            font=("Arial", 18),
            fg="#b2c7d9",
            bg="#0b1d2a",
            justify="center",
        )
        message.pack(pady=(0, 40))

        entry_label = tk.Label(
            container,
            text="Código de desbloqueo",
            font=("Arial", 16),
            fg="#ffffff",
            bg="#0b1d2a",
        )
        entry_label.pack(pady=(0, 10))

        self.code_var = tk.StringVar()
        entry = tk.Entry(
            container,
            textvariable=self.code_var,
            font=("Arial", 24),
            width=10,
            justify="center",
            show="*",
        )
        entry.pack()
        entry.focus_set()
        entry.bind("<Return>", self._attempt_unlock)

        unlock_btn = tk.Button(
            container,
            text="Desbloquear",
            font=("Arial", 18, "bold"),
            command=self._attempt_unlock,
            bg="#1f6feb",
            fg="#ffffff",
            activebackground="#1a4f8b",
            activeforeground="#ffffff",
            padx=30,
            pady=10,
        )
        unlock_btn.pack(pady=30)

    def _attempt_unlock(self, event: tk.Event | None = None) -> None:
        if self.code_var.get() == self.unlock_code:
            self.root.destroy()
        else:
            self.code_var.set("")
            messagebox.showerror("Código incorrecto", "El código introducido no es válido.")

    def _enforce_fullscreen(self) -> None:
        self.root.attributes("-fullscreen", True)
        self.root.after(1000, self._enforce_fullscreen)

    def _restore_focus(self, event: tk.Event) -> None:
        self.root.focus_force()
        self.root.after(100, self.root.focus_force)

    def _keep_fullscreen(self, event: tk.Event) -> str:
        self.root.after(10, lambda: self.root.attributes("-fullscreen", True))
        return "break"

    def _block_event(self) -> None:
        pass

    def run(self) -> None:
        self.root.mainloop()


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Pantalla de bloqueo para estaciones de ciber-café",
    )
    parser.add_argument(
        "--code",
        dest="code",
        default=os.environ.get("CYBERCAFE_UNLOCK_CODE", DEFAULT_CODE),
        help="Código secreto para desbloquear la estación.",
    )
    parser.add_argument(
        "--message",
        dest="message",
        default=os.environ.get("CYBERCAFE_LOCK_MESSAGE", DEFAULT_MESSAGE),
        help="Mensaje mostrado mientras la estación está bloqueada.",
    )
    parser.add_argument(
        "--show-cursor",
        dest="show_cursor",
        action="store_true",
        help="No ocultar el cursor del ratón.",
    )
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    screen = LockScreen(args.code, args.message, show_cursor=args.show_cursor)
    screen.run()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
