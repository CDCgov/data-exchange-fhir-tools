
# HL7 FHIR Connecthaton 34, [HELIOS Align and Optimize (A&O)](https://confluence.hl7.org/pages/viewpage.action?pageId=175606977)


## Workflow: Query for Supplemental Information, Scenario 2: Positive Reportable Condition (STI)


-	Notable achievements 
-	Screenshots and/or links to further information
-	Discovered issues / questions - if there are any)


# Summary
- ...


- Why?
- How?

## 1. PHA Receives ELR 

- Example: Synthetic ELR HL7
- Demographics
- Test Result
- __No diagnosis and Treatment (Medication)__

Note: PHA _has system_ triger the searches for completing the Case Report 

# 2. (PHA System) Client Authentication
- Connecthaton ( open sand box )
- Symetric Shared Secret
- Asymetric Auth

# 3. (PHA System) Client Authorization 
system/Patient.read 
system/MedicationRequest.read
system/Condition.read 

# 4. Searches for Completing Report

__Postman Demo__

- Patient information
- Condition ( e.g. other relevant diagnosis )
- Treatment  (Medication )

__Client App Demo__

# Questions
