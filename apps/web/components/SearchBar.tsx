import { Button } from "@maricopa-senior-living/ui/components/button";
import { ButtonGroup } from "@maricopa-senior-living/ui/components/button-group";
import { Card, CardContent } from "@maricopa-senior-living/ui/components/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@maricopa-senior-living/ui/components/field";
import { Input } from "@maricopa-senior-living/ui/components/input";
import { SearchIcon } from "lucide-react";

/** `id` must be unique per page — the layout can render two search boxes. */
export default function SearchBar({
  id = "search",
  defaultValue,
}: {
  id?: string;
  defaultValue?: string;
}) {
  return (
    <Card>
      <CardContent>
        <form action="/search" method="get" role="search">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={id} className="text-base">
                Search resources and articles
              </FieldLabel>
              <ButtonGroup className="w-full">
                <Input
                  id={id}
                  name="q"
                  type="search"
                  placeholder="Meals, rides…"
                  defaultValue={defaultValue}
                  className="h-12 text-lg"
                  required
                />
                <Button type="submit" className="h-12 px-5 text-base">
                  <SearchIcon aria-hidden="true" />
                  Search
                </Button>
              </ButtonGroup>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
