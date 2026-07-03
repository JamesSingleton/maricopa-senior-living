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

export default function SearchBar() {
  return (
    <Card>
      <CardContent>
        <form action="/search" method="get" role="search">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="search" className="sr-only">
                Search
              </FieldLabel>
              <ButtonGroup className="w-full">
                <Input
                  id="search"
                  name="q"
                  type="search"
                  placeholder="Search"
                  required
                />
                <Button type="submit" variant="outline" aria-label="Search">
                  <SearchIcon />
                </Button>
              </ButtonGroup>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
