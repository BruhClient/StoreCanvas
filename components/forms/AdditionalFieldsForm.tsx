import React from "react";
import AddAdditionalFieldsDialog from "../AddAdditionalFieldsDialog";
import { UseFormReturn } from "react-hook-form";
import { showErrorToast } from "@/lib/toast";
import { AnimatePresence } from "motion/react";
import { MotionDiv } from "../Motion";
import { Button } from "../ui/button";
import { Edit, Plus, X } from "lucide-react";
import { containerVariants } from "@/lib/variants";
import { CreateAdditionalFieldsPayload } from "@/schemas/create-addtional-fields";
import { AdditionalFieldsPayload } from "@/schemas/store-steps";

const AdditionalFieldsForm = ({
  form,
}: {
  form: UseFormReturn<AdditionalFieldsPayload>;
}) => {
  const { setValue, watch } = form;
  const additionalFields = watch("additionalFields");
  const removeField = (prompt: string) => {
    setValue(
      "additionalFields",
      additionalFields?.filter((field) => field.prompt !== prompt)
    );
  };

  const addField = (field: CreateAdditionalFieldsPayload) => {
    if (
      additionalFields.find(
        (userField) => userField.prompt === field.prompt.trim()
      )
    ) {
      showErrorToast("This prompt already exist");
      return;
    }

    // Set limit for Fields

    if (additionalFields.length >= 3) {
      showErrorToast("You have reached your limit");
    } else {
      setValue("additionalFields", [...additionalFields, field]);
    }
  };

  const editField = (
    prevPrompt: string,
    field: CreateAdditionalFieldsPayload
  ) => {
    if (
      prevPrompt !== field.prompt &&
      additionalFields.find(
        (userField) => userField.prompt === field.prompt.trim()
      )
    ) {
      showErrorToast("This prompt already exist");
      return;
    }

    console.log();
    setValue(
      "additionalFields",
      additionalFields.map((userFields) => {
        if (userFields.prompt === prevPrompt) {
          return field;
        }
        return userFields;
      })
    );
  };
  return (
    <div className="space-y-2">
      <AddAdditionalFieldsDialog updateFields={addField}>
        <Button
          className="w-full create-field-button"
          size={"lg"}
          variant={"outline"}
          type="button"
        >
          <Plus /> Add Field
        </Button>
      </AddAdditionalFieldsDialog>
      <div className="space-y-3 min-h-[300px] field-feed">
        <AnimatePresence>
          {additionalFields?.map((field) => {
            return (
              <MotionDiv
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={field.prompt}
                className="shadow-sm flex justify-between items-center px-3 py-2 rounded-lg border-2"
              >
                <div className="flex flex-col">
                  <div className="font-bold self-start text-sm">
                    {field.prompt}
                  </div>
                  <div className="self-start text-xs text-muted-foreground">
                    {field.type}
                  </div>
                </div>
                <div>
                  <AddAdditionalFieldsDialog
                    updateFields={(updatedField) => {
                      editField(field.prompt, updatedField);
                    }}
                    values={field}
                  >
                    <Button size={"icon"} variant={"ghost"} type="button">
                      <Edit />
                    </Button>
                  </AddAdditionalFieldsDialog>
                  <Button
                    onClick={() => removeField(field.prompt)}
                    variant={"ghost"}
                    size={"icon"}
                    type="button"
                  >
                    <X />
                  </Button>
                </div>
              </MotionDiv>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdditionalFieldsForm;
