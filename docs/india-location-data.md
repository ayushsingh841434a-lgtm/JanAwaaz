# India location master data

JanAwaaz stores administrative geography in PostgreSQL `Location` rows. The
project intentionally ships no hand-maintained State, District, village, city,
or ward list: those records change and must come from a verified source.

## Authoritative source

Use a current export from the Government of India's Local Government Directory
(LGD), Ministry of Panchayati Raj: <https://lgdirectory.gov.in/>. Record the
export date with `LOCATION_DATA_VERIFIED_AT` and retain the source name in
`LOCATION_DATA_SOURCE`. Do not replace an unavailable LGD value with a guess.
The country row is identified separately using the ISO 3166-1 alpha-2 code
`IN`.

The application currently has no LGD export in its repository, and its
geographic master tables remain empty until an authorized LGD export is
prepared and imported. Consequently, imported coverage counts are zero until
that step is completed; free-text report entry remains available.

## Import CSV format

The normalized UTF-8 CSV has these required columns:

```csv
type,code,name,parentType,parentCode,blockCode,aliases,lastVerifiedAt
STATE,<official-code>,<official-name>,COUNTRY,IN,,<alias1>|<alias2>,YYYY-MM-DD
DISTRICT,<official-code>,<official-name>,STATE,<state-code>,,<aliases>,YYYY-MM-DD
SUB_DISTRICT,<official-code>,<official-name>,DISTRICT,<district-code>,,<aliases>,YYYY-MM-DD
BLOCK,<official-code>,<official-name>,DISTRICT,<district-code>,,<aliases>,YYYY-MM-DD
VILLAGE,<official-code>,<official-name>,SUB_DISTRICT,<sub-district-code>,<block-code>,<aliases>,YYYY-MM-DD
CITY,<official-code>,<official-name>,DISTRICT,<district-code>,,<aliases>,YYYY-MM-DD
TOWN,<official-code>,<official-name>,DISTRICT,<district-code>,,<aliases>,YYYY-MM-DD
MUNICIPAL_BODY,<official-code>,<official-name>,DISTRICT,<district-code>,,<aliases>,YYYY-MM-DD
WARD,<official-code>,<official-name>,MUNICIPAL_BODY,<municipal-body-code>,,<aliases>,YYYY-MM-DD
```

`DIVISION` may be included between a State and its Districts. A District may
belong directly to a State or to a Division. Names and codes must be copied
from the source export; aliases are optional search terms and never replace
official names. `blockCode` is an optional Block code for a Village and is
checked against the same District. The importer validates types, mandatory
names/codes, parent existence, duplicate codes, and cross-district village /
block relationships before writing anything.

Map source-export columns into this format before import. Keep one stable
`LOCATION_DATA_SOURCE` value across refreshes so unique source codes upsert
existing records instead of duplicating them:

```powershell
$env:LOCATION_DATA_SOURCE = "Local Government Directory (LGD), Ministry of Panchayati Raj"
$env:LOCATION_DATA_VERIFIED_AT = "YYYY-MM-DD"
npm run import:locations -- .\data\lgd-locations.csv
```

The import is idempotent and updates records in 250-row PostgreSQL batches.
It validates the complete input file before writing and prints counts by
administrative type on success. A database failure can leave completed batches
in place; rerun the same import to safely finish. Validation errors exit
non-zero without importing rows. Never commit restricted or personal data
from a source export.

## Privacy and operational notes

- `Report` retains existing State, District, City and Area snapshots, with
  optional administrative-level snapshots and a nullable foreign key to the
  selected official location.
- Citizen-entered localities stay attached to the report; they are not
  promoted to public master data.
- Public map endpoints continue to aggregate reports at known city centers.
  They do not use individual GPS coordinates.
- An authorized data operator should review each export and its coverage
  before import. Admin-only edit endpoints are intentionally not provided.
