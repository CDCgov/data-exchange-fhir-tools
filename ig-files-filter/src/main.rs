use walkdir::WalkDir;


fn main() {

    let needed_files_arr = vec!["CapabilityStatement", "StructureDefinition", "ValueSet"];

    let mut count_all = 0;
    let mut count_filtered = 0;

    for entry in WalkDir::new("hcs_ig_files_all")
        .into_iter()
        .filter_map(|v| v.ok()) {

            count_all += 1; 
            //let path = entry.path();
            let file_name = entry.file_name().to_string_lossy();

            if needed_files_arr.iter().any(|e| file_name.starts_with(e)) {

                count_filtered += 1;
                println!("File name (Needed): {}", file_name); 

            } else {

                println!("File name: {}", file_name); 
            } // .else 

            //println!("{}", entry.path().display()); 
    } // .for

    println!("Count all files: {}", count_all);
    println!("Count filtered files: {}", count_filtered);

} // fn .main 

