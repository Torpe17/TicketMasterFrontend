import { useState, useEffect } from 'react';
import { Combobox, TextInput, useCombobox } from '@mantine/core';


const AdminPage = () =>{    
    const films = ['Dragon Ball Super: Broly', 'Dragon Ball Super: Super Hero', 'Star Wars: Episode VI - Return of the Jedi'];

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [value, setValue] = useState('');
    const shouldFilterOptions = !films.some((item) => item === value);
    const filteredOptions = shouldFilterOptions
        ? films.filter((item) => item.toLowerCase().includes(value.toLowerCase().trim()))
        : films;

    const options = filteredOptions.map((item) => (
        <Combobox.Option value={item} key={item}>
        {item}
        </Combobox.Option>
    ));

    useEffect(() => {
        // we need to wait for options to render before we can select first one
        combobox.selectFirstOption();
    }, [value]);

    return (
        <Combobox
        onOptionSubmit={(optionValue) => {
            setValue(optionValue);
            combobox.closeDropdown();
        }}
        store={combobox}
        >
        <Combobox.Target>
            <TextInput
            label="Film kiválasztása"
            placeholder="Kiválasztás..."
            value={value}
            onChange={(event) => {
                setValue(event.currentTarget.value);
                combobox.openDropdown();
            }}
            onClick={() => combobox.openDropdown()}
            onFocus={() => combobox.openDropdown()}
            onBlur={() => combobox.closeDropdown()}
            />
        </Combobox.Target>

        <Combobox.Dropdown>
            <Combobox.Options>
            {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
            </Combobox.Options>
        </Combobox.Dropdown>
        </Combobox>
    );
}

export default AdminPage;
