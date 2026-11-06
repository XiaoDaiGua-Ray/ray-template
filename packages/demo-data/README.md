# @ray-template/demo-data

Browser-independent fixtures and query helpers shared by the frontend HTTP mocks and the optional server demo module. They depend only on the API contracts, Valibot, and Faker. They contain no accounts with usable production credentials, database connection, Storage access, or application imports.

The root export exposes `initialRoutes`, `initialUserOptions`, `charts`, `requestFixture`, and the query helpers. Focused subpaths expose `orders`, `people`, `users`, and `route-people`. The frontend compatibility files delegate here. Backend seed initialization must preserve existing records and provision credentials separately.

Route JSON contains registered view identifiers, never executable components. Update the frontend view catalog alongside route configuration when adding a page.
