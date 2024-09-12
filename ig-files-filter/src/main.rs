use walkdir::WalkDir;
use std::fs;
use std::path::Path;


fn main() {
    
    let source_dir = "hcs_ig_files_all";
    let target_dir = "hcs_ig_files_filtered";

    let needed_files_arr = vec!["CapabilityStatement", "StructureDefinition", "ValueSet", "CodeSystem"];
    let skip_folders = vec!["openapi", "example", "xml"];

    let mut count_all = 0;
    let mut count_filtered = 0;

    for entry in WalkDir::new(source_dir)
        .into_iter()
        .filter_map(|v| v.ok()) {

            count_all += 1;

            let entry_name = entry.file_name().to_string_lossy();

            let source_path = entry.path();
            
            if source_path.components().any(|c| {
                c.as_os_str().to_str().map_or(false, |s| skip_folders.contains(&s))
            }) {
                println!("Skipping: {}", source_path.display());
                continue;
            } // .if                 

            if needed_files_arr.iter().any(|e| entry_name.starts_with(e)) {

                let relative_path = source_path.strip_prefix(source_dir).unwrap();
                let target_path = Path::new(target_dir).join(relative_path);

                if let Some(parent_dir) = target_path.parent() {
                    if !parent_dir.exists() {
                        fs::create_dir_all(parent_dir).expect("Failed to create directory");
                    }// .if
                }// .if 
                
                fs::copy(source_path, &target_path).expect("Failed to copy file");


                count_filtered += 1;
                println!("File name (Needed): {}", entry_name);
                println!("Copied from path: {}", source_path.display());

            } else {

                println!("File name: {}", entry_name); 
            } // .else 

    } // .for

    println!("Count all files: {}", count_all);
    println!("Count filtered files: {}", count_filtered);

} // fn .main 

