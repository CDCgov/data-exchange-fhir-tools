# IG Files Filter 

## To use 

```
$ cargo run src/main.rs 
```

- Local directory: __hcs_ig_files_all__, Here are the downloaded IG resource folders and files. These are read recursively. This directory is gitignored. 

- Local directory: __hcs_ig_files_filtered__, Here are the copies of the filtered files based on the filtering rules.

Filtering rules:
- File name starts with: "CapabilityStatement", "StructureDefinition", "ValueSet".
- Files are not in the openapi directory.

Note: Copied files in __hcs_ig_files_filtered__ will preserve path from the source folder.


