import os

def print_folder_structure(path, indent=0):
    try:
        items = os.listdir(path)
    except PermissionError:
        print('  ' * indent + '[Permission Denied]')
        return

    for item in items:
        item_path = os.path.join(path, item)
        print('  ' * indent + '|-- ' + item)
        if os.path.isdir(item_path):
            print_folder_structure(item_path, indent + 1)

if __name__ == '__main__':
    root_path = input("Enter folder path to print structure: ").strip()
    if os.path.exists(root_path):
        print(f"Folder structure of '{root_path}':")
        print_folder_structure(root_path)
    else:
        print("Invalid path.")
