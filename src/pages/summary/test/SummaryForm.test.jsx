import { render, screen, fireEvent } from "@testing-library/react";
import SummaryForm from "../SummaryForm";

test("initial conditions", () => {
  render(<SummaryForm />);

  const confirmButton = screen.getByRole("button", { name: "Confirm Order" });
  const termsCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  expect(confirmButton).toBeDisabled();
  expect(termsCheckbox).not.toBeChecked();
});

test("checkbox disables button on first click and enables on second click", () => {
  render(<SummaryForm />);

  const confirmButton = screen.getByRole("button", { name: "Confirm Order" });
  const termsCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });

  fireEvent.click(termsCheckbox);

  expect(confirmButton).toBeEnabled();

  fireEvent.click(termsCheckbox);

  expect(confirmButton).toBeDisabled();
});
