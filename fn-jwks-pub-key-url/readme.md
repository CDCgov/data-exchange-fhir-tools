# jwks_url

(Non production) Azure function that provides the __public__ part of the JWKS as required by SMART [Backend Services Authorization Guide](https://hl7.org/fhir/uv/bulkdata/authorization/index.html)

## JWKS Algorithms
Example of exposed endpoints running locally:
- RS256 at http://localhost:7071/api/jwks_url/rs256
- RS384 at http://localhost:7071/api/jwks_url/rs384

## References
[SMART Backend Services Authorization Guide](https://hl7.org/fhir/uv/bulkdata/authorization/index.html)

[SMART App Launch, Client Authentication: Asymmetric (public key)](https://build.fhir.org/ig/HL7/smart-app-launch/client-confidential-asymmetric.html#client-authentication-asymmetric-public-key)
