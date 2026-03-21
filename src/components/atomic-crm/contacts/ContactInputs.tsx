import { email, required, useTranslate } from "ra-core";
import type { FocusEvent, ClipboardEventHandler } from "react";
import { useFormContext } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { BooleanInput } from "@/components/admin/boolean-input";
import { ReferenceInput } from "@/components/admin/reference-input";
import { TextInput } from "@/components/admin/text-input";
import { RadioButtonGroupInput } from "@/components/admin/radio-button-group-input";
import { SelectInput } from "@/components/admin/select-input";
import { ArrayInput } from "@/components/admin/array-input";
import { SimpleFormIterator } from "@/components/admin/simple-form-iterator";

import {
  contactGender,
  translateContactGenderLabel,
  translatePersonalInfoTypeLabel,
} from "./contactGender";
import type { Sale } from "../types";
import { Avatar } from "./Avatar";

const socialLinkTypes = [
  { id: "LinkedIn", name: "LinkedIn" },
  { id: "Twitter", name: "Twitter / X" },
  { id: "Instagram", name: "Instagram" },
  { id: "Facebook", name: "Facebook" },
  { id: "YouTube", name: "YouTube" },
  { id: "TikTok", name: "TikTok" },
  { id: "Other", name: "Other" },
];
import { AutocompleteCompanyInput } from "../companies/AutocompleteCompanyInput.tsx";
import { useConfigurationContext } from "../root/ConfigurationContext";

export const ContactInputs = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-2 p-1 relative md:static">
      <div className="absolute top-0 right-1 md:static">
        <Avatar />
      </div>
      <ContactIdentityInputs />
      {isMobile ? null : <Separator />}
      <ContactPersonalInformationInputs />
      {isMobile ? null : <Separator />}
      <ContactPositionInputs />
      {isMobile ? null : <Separator />}
      <ContactMiscInputs />
    </div>
  );
};

const ContactIdentityInputs = () => {
  const translate = useTranslate();
  return (
    <div className="flex flex-col gap-4">
      <h6 className="text-lg font-semibold">
        {translate("resources.contacts.field_categories.identity")}
      </h6>
      <RadioButtonGroupInput
        label={false}
        row
        source="gender"
        choices={contactGender}
        helperText={false}
        optionText={(choice) => translateContactGenderLabel(choice, translate)}
        translateChoice={false}
        optionValue="value"
        defaultValue={contactGender[0].value}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          source="first_name"
          validate={required()}
          helperText={false}
        />
        <TextInput
          source="last_name"
          validate={required()}
          helperText={false}
        />
      </div>
    </div>
  );
};

const ContactPositionInputs = () => {
  const translate = useTranslate();
  return (
    <div className="flex flex-col gap-4">
      <h6 className="text-lg font-semibold">
        {translate("resources.contacts.field_categories.position")}
      </h6>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput source="title" helperText={false} />
        <ReferenceInput source="company_id" reference="companies" perPage={10}>
          <AutocompleteCompanyInput label="resources.contacts.fields.company_id" />
        </ReferenceInput>
      </div>
    </div>
  );
};

const ContactPersonalInformationInputs = () => {
  const translate = useTranslate();
  const { getValues, setValue } = useFormContext();
  const personalInfoTypes = [
    {
      id: "Work",
      name: translatePersonalInfoTypeLabel("Work", translate),
    },
    {
      id: "Home",
      name: translatePersonalInfoTypeLabel("Home", translate),
    },
    {
      id: "Other",
      name: translatePersonalInfoTypeLabel("Other", translate),
    },
  ];

  // set first and last name based on email
  const handleEmailChange = (email: string) => {
    const { first_name, last_name } = getValues();
    if (first_name || last_name || !email) return;
    const [first, last] = email.split("@")[0].split(".");
    setValue("first_name", first.charAt(0).toUpperCase() + first.slice(1));
    setValue(
      "last_name",
      last ? last.charAt(0).toUpperCase() + last.slice(1) : "",
    );
  };

  const handleEmailPaste: ClipboardEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    const email = e.clipboardData?.getData("text/plain");
    handleEmailChange(email);
  };

  const handleEmailBlur = (
    e: FocusEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const email = e.target.value;
    handleEmailChange(email);
  };

  return (
    <div className="flex flex-col gap-4">
      <h6 className="text-lg font-semibold">
        {translate("resources.contacts.field_categories.personal_info")}
      </h6>
      <ArrayInput source="email_jsonb" helperText={false}>
        <SimpleFormIterator
          inline
          disableReordering
          disableClear
          className="[&>ul>li]:border-b-0 [&>ul>li]:pb-0"
        >
          <TextInput
            source="email"
            className="w-full"
            helperText={false}
            label={false}
            placeholder={translate("resources.contacts.fields.email")}
            validate={email()}
            onPaste={handleEmailPaste}
            onBlur={handleEmailBlur}
          />
          <SelectInput
            source="type"
            helperText={false}
            label={false}
            optionText="name"
            choices={personalInfoTypes}
            defaultValue="Work"
            className="w-24 min-w-24"
          />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="phone_jsonb" helperText={false}>
        <SimpleFormIterator
          inline
          disableReordering
          disableClear
          className="[&>ul>li]:border-b-0 [&>ul>li]:pb-0"
        >
          <TextInput
            source="number"
            className="w-full"
            helperText={false}
            label={false}
            placeholder={translate("resources.contacts.fields.phone_number")}
          />
          <SelectInput
            source="type"
            helperText={false}
            label={false}
            optionText="name"
            choices={personalInfoTypes}
            defaultValue="Work"
            className="w-24 min-w-24"
          />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="social_links_jsonb" helperText={false}>
        <SimpleFormIterator
          inline
          disableReordering
          disableClear
          className="[&>ul>li]:border-b-0 [&>ul>li]:pb-0"
        >
          <TextInput
            source="url"
            className="w-full"
            helperText={false}
            label={false}
            placeholder={translate("resources.contacts.fields.social_url")}
          />
          <SelectInput
            source="type"
            helperText={false}
            label={false}
            optionText="name"
            choices={socialLinkTypes}
            defaultValue="LinkedIn"
            className="w-32 min-w-32"
          />
        </SimpleFormIterator>
      </ArrayInput>
    </div>
  );
};

const ContactMiscInputs = () => {
  const translate = useTranslate();
  const { leadSources, contactTypes } = useConfigurationContext();
  return (
    <div className="flex flex-col gap-4">
      <h6 className="text-lg font-semibold">
        {translate("resources.contacts.field_categories.misc")}
      </h6>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectInput
          source="lead_source"
          helperText={false}
          choices={leadSources.map((s) => ({ id: s.value, name: s.label }))}
          emptyText={translate("crm.common.none")}
          emptyValue=""
        />
        <SelectInput
          source="contact_type"
          helperText={false}
          choices={contactTypes.map((t) => ({ id: t.value, name: t.label }))}
          emptyText={translate("crm.common.none")}
          emptyValue=""
        />
        <BooleanInput source="has_newsletter" helperText={false} />
      </div>
      <TextInput source="background" multiline helperText={false} />
      <ReferenceInput
        reference="sales"
        source="sales_id"
        sort={{ field: "last_name", order: "ASC" }}
        filter={{
          "disabled@neq": true,
        }}
      >
        <SelectInput
          helperText={false}
          optionText={saleOptionRenderer}
          validate={required()}
        />
      </ReferenceInput>
    </div>
  );
};

const saleOptionRenderer = (choice: Sale) =>
  `${choice.first_name} ${choice.last_name}`;
