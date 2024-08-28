# IG Files Filter 

## To use 

```
$ cargo run src/main.rs 
```

- Local directory: __hcs_ig_files_all__, Here should be allthe downloaded IG resource files.
- Local directory: __hcs_ig_files_filtered__, Here are copied only the filtered files based on the filtering rules.

Filtering rules:
- File name starts with: "CapabilityStatement", "StructureDefinition", "ValueSet".
- Files are not in the openapi directory.

Note: Copied files in hcs_ig_files_filtered will preserve path.


