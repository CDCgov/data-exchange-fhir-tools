# IG Files Filter 

## To use 

```
$ cargo run src/main.rs 
```

- Local directory: __hcs_ig_files_all__, The downloaded IG resource folders and files. These are read recursively. This directory is gitignored. 

- Local directory: __hcs_ig_files_filtered__, The copies of the filtered folders and files based on the filtering rules.

Filtering rules:
- File name starts with: "CapabilityStatement", "StructureDefinition", "ValueSet".
- Files are not in the openapi directory.

Note: Copied files in __hcs_ig_files_filtered__ will preserve path from the source folder.


