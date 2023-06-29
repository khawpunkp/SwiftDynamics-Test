// Import Packages
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select, Space, Table } from 'antd';
import { SortOrder } from 'antd/es/table/interface';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

// Import Data
import nationalities from '../data/nationalities.json';
import dialCodes from '../data/dialing code.json';
import titles from '../data/title.json';
import genders from '../data/gender.json';

// Import CSS
import './form.css';

// Import Redux
import { RootState, AppDispatch, userActions, User } from '../store/reducer';

function FormPage(props: any) {
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();

    // Constant to Control Checkbox
    const [allSelected, setAllSelected] = useState(false);

    // Constant to triggered Editing State
    const [isEdit, setIsEdit] = useState(false);

    // Constant to stroe the editting user data
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Get unique dial codes
    const uniqueDialCodes = dialCodes
        .map((option) => option.dial_code)
        .filter((dialCode, index, array) => array.indexOf(dialCode) === index);

    // Sort the dial codes
    const sortedDial = uniqueDialCodes.sort((a, b) => {
        const codeA = parseInt(a.replace("+", ""));
        const codeB = parseInt(b.replace("+", ""));
        return codeA - codeB;
    });

    // Sort the nationalities 
    const sortedNationalities = nationalities.sort((a, b) =>
        i18n.language === 'en' ? a.enName.localeCompare(b.enName) : a.name.localeCompare(b.name)
    );

    // Access user data from the store
    const userData = useSelector((state: RootState) => state.users);

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    // Dispatch actions to update user data
    const dispatch = useDispatch<AppDispatch>();

    // Column of the table
    const columns = [
        {
            title: <Checkbox
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
            />,
            dataIndex: 'selectAll',
            render: (_: any, record: User) => (
                <Checkbox
                    checked={selectedUserIds.includes(record.id)}
                    onChange={() => handleSelect(record.id)}
                />
            ),
        },
        {
            title: t('name'),
            dataIndex: 'name',
            render: (text: string, record: User) => `${record.firstName} ${record.lastName}`,
            defaultSortOrder: 'descend' as SortOrder,
            sorter: (a: User, b: User) => a.firstName.localeCompare(b.firstName),
            width: 200,
        },
        {
            title: t('gender'),
            dataIndex: 'gender',
            render: (text: string, record: User) => {
                const gender = genders.find((item) => item.id === record.gender);

                // Determine the gender label based on the current language
                const genderLabel =
                    i18n.language === 'en' ? gender?.enName : gender?.name;
                return genderLabel;
            },
            defaultSortOrder: 'descend' as SortOrder,
            sorter: (a: User, b: User) => {
                const genderA = genders.find((item) => item.id === a.gender);
                const genderB = genders.find((item) => item.id === b.gender);
                const genderLabelA = i18n.language === 'en' ? genderA?.enName : genderA?.name;
                const genderLabelB = i18n.language === 'en' ? genderB?.enName : genderB?.name;
                return (genderLabelA || '').localeCompare(genderLabelB || '');
            },
            width: 200,
        },
        {
            title: t('phone_number'),
            dataIndex: 'phoneNumber',
            defaultSortOrder: 'descend' as SortOrder,
            sorter: (a: User, b: User) => a.phoneNumber.localeCompare(b.phoneNumber),
            width: 400,
        },
        {
            title: t('nationality'),
            dataIndex: 'nationality',
            render: (text: string, record: User) => {
                const nationality = nationalities.find((item) => item.alpha3 === record.nationality);
                // Determine the nationality label based on the current language
                const nationalityLabel =
                    i18n.language === 'en' ? nationality?.enName : nationality?.name;
                return nationalityLabel;
            },
            defaultSortOrder: 'descend' as SortOrder,
            sorter: (a: User, b: User) => {
                const nationalityA = nationalities.find((item) => item.alpha3 === a.nationality);
                const nationalityB = nationalities.find((item) => item.alpha3 === b.nationality);
                const nationalityLabelA = i18n.language === 'en' ? nationalityA?.enName : nationalityA?.name;
                const nationalityLabelB = i18n.language === 'en' ? nationalityB?.enName : nationalityB?.name;
                return (nationalityLabelA || '').localeCompare(nationalityLabelB || '');
            },
            width: 300,
        },
        {
            title: t('action'),
            key: 'action',
            render: (_: any, record: User) => (
                <Space size="middle">
                    <a onClick={() => handleEditUser(record.id)}>{t('edit')}</a>
                    <a onClick={() => handleDeleteUser(record.id)}>{t('delete')}</a>
                </Space>
            ),
            width: 120,
        }
    ];

    // Handle the checkbox
    const handleSelect = (userId: string) => {
        setSelectedUserIds((prevSelectedUserIds) => {
            // If the user id is in the selectedUserIds array, remove it
            if (prevSelectedUserIds.includes(userId)) {
                return prevSelectedUserIds.filter((id) => id !== userId);
            }
            // If the user id is not in the selectedUserIds array, add it
            else {
                return [...prevSelectedUserIds, userId];
            }
        });
    };

    const handleSelectAll = (checked: boolean) => {
        setAllSelected(checked);
        if (checked) {
            setSelectedUserIds(userData.map((user) => user.id));
        } else {
            setSelectedUserIds([]);
        }
    };

    // Clear the form
    const handleClearForm = () => {
        form.resetFields();
    };

    // Handle only number input
    const handleNumber = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // If not number or backspace prevent the key pressed
        if (!/[0-9]/.test(event.key) && !(event.key === 'Backspace')) {
            event.preventDefault();
        }
    };

    // Validate the phone number
    const validatePhoneNumber = (_: any, value: any) => {
        // If empty return Promise reject
        if (!value) {
            return Promise.reject(new Error(`${t('enter')} '${t('phone_number')}'`));
        }
        // If not number return Promise reject
        else if (value && !/^\d+$/.test(value)) {
            return Promise.reject(new Error(t('number_error')));
        }
        // If not 10 digits return Promise reject
        else if (value.length !== 10) {
            return Promise.reject(new Error(t('phone_error')));
        }
        return Promise.resolve();
    };

    // Validate the salary
    const validateSalary = (_: any, value: any) => {
        // If empty return Promise reject
        if (!value) {
            return Promise.reject(new Error(`${t('enter')} '${t('salary')}'`));
        }
        // If not number return Promise reject
        else if (value && !/^\d+$/.test(value)) {
            return Promise.reject(new Error(t('number_error')));
        }
        return Promise.resolve();
    };

    // Validate the ID number
    const validateIDNumber = (_: any, values: any) => {
        // Get the ID number
        const id1 = form.getFieldValue('ID1') || '';
        const id2 = form.getFieldValue('ID2') || '';
        const id3 = form.getFieldValue('ID3') || '';
        const id4 = form.getFieldValue('ID4') || '';
        const id5 = form.getFieldValue('ID5') || '';
        const combinedIDNumber = id1 + id2 + id3 + id4 + id5;

        // If empty return Promise resolve
        if (!combinedIDNumber) {
            return Promise.resolve();
        }
        // If not number return Promise reject
        else if (!/^\d+$/.test(combinedIDNumber)) {
            return Promise.reject(new Error(t('number_error')));
        }
        // If not 13 digits return Promise reject
        else if (combinedIDNumber.length !== 13) {
            return Promise.reject(new Error(t('id_error')));
        }
        return Promise.resolve();
    }

    // Validate the Passport number
    const validatePassport = (_: any, value: any) => {
        // Passport Number Pattern (1-2 Capital Letters + 6-7 Digits)
        const passportNumberPattern = /^[A-Z]{1,2}\d{6,7}$/;

        // If empty return Promise resolve
        if (!value) {
            return Promise.resolve();
        }
        // If not match the pattern return Promise reject
        else if (!passportNumberPattern.test(value)) {
            return Promise.reject(new Error(t('passport_error')));
        }
        return Promise.resolve();
    };

    // Form submit
    const handleFormSubmit = (values: any) => {
        // Convert the date
        const birthDate = values['Birth Date'];
        const serializedBirthDate = moment(birthDate).format('YYYY-MM-DD');

        // Convert the Phone Number
        let telNumber = ''
        if (values['Dial Code'] && values['Phone Number']) {
            telNumber = values['Dial Code'] + values['Phone Number'];
        }

        // Convert the Salary
        const expectedSalary = parseFloat(values['Expected Salary']);

        const formData: User = {
            id: uuidv4(),
            title: values['Title'],
            firstName: values['First Name'],
            lastName: values['Last Name'],
            birthDate: serializedBirthDate,
            nationality: values['Nationality'],
            id1: values['ID1'],
            id2: values['ID2'],
            id3: values['ID3'],
            id4: values['ID4'],
            id5: values['ID5'],
            idNumber: values['ID1'] + values['ID2'] + values['ID3'] + values['ID4'] + values['ID5'],
            gender: values['Gender'],
            dial: values['Dial Code'],
            number: values['Phone Number'],
            phoneNumber: telNumber,
            passportNumber: values['Passport'],
            salary: expectedSalary,
        };

        dispatch(userActions.addUser(formData));

        form.resetFields();
    };

    // Delete multiple users
    const handleDeleteUsers = (idsToRemove: string[]) => {
        setAllSelected(false);
        dispatch(userActions.removeUsers(idsToRemove));
    };

    // Delete a user
    const handleDeleteUser = (idToRemove: string) => {
        dispatch(userActions.removeUser(idToRemove));
    };

    // Set the User id to edit
    const handleEditUser = (idToEdit: string) => {
        const userToEdit = userData.find((user) => user.id === idToEdit) || null;
        setEditingUser(userToEdit);
    };

    // Change the form values when editing user
    useEffect(() => {
        if (editingUser) {
            form.setFieldsValue({
                'Title': editingUser?.title,
                'First Name': editingUser?.firstName,
                'Last Name': editingUser?.lastName,
                'Birth Date': editingUser ? moment(editingUser.birthDate) : undefined,
                'Nationality': editingUser?.nationality,
                'ID1': editingUser?.id1,
                'ID2': editingUser?.id2,
                'ID3': editingUser?.id3,
                'ID4': editingUser?.id4,
                'ID5': editingUser?.id5,
                'Gender': editingUser?.gender,
                'Dial Code': editingUser?.dial,
                'Phone Number': editingUser?.number,
                'Passport': editingUser?.passportNumber,
                'Expected Salary': editingUser?.salary,
            });

            // Set Edit State and Form Values
            setIsEdit(true);
            form.setFieldsValue(editingUser);
        }
    }, [editingUser, form]);

    // Update the user data 
    const handleEditSubmit = (values: any) => {
        if (!editingUser) {
            // Handle the case when editingUser is null
            return;
        }
        // Convert the date
        const birthDate = values['Birth Date'];
        const serializedBirthDate = moment(birthDate).format('YYYY-MM-DD');

        // Convert the Phone Number
        let telNumber = ''
        if (values['Dial Code'] && values['Phone Number']) {
            telNumber = values['Dial Code'] + values['Phone Number'];
        }

        // Convert the Salary
        const expectedSalary = parseFloat(values['Expected Salary']);

        // Create User Data to Dispatch
        const formData: User = {
            id: editingUser?.id || '',
            title: values['Title'],
            firstName: values['First Name'],
            lastName: values['Last Name'],
            birthDate: serializedBirthDate,
            nationality: values['Nationality'],
            id1: values['ID1'],
            id2: values['ID2'],
            id3: values['ID3'],
            id4: values['ID4'],
            id5: values['ID5'],
            idNumber: values['ID1'] + values['ID2'] + values['ID3'] + values['ID4'] + values['ID5'],
            gender: values['Gender'],
            dial: values['Dial Code'],
            number: values['Phone Number'],
            phoneNumber: telNumber,
            passportNumber: values['Passport'],
            salary: expectedSalary,
        };

        // Dispatch the Action
        dispatch(userActions.updateUser({ id: editingUser.id, user: formData }));

        // Reset the Form
        form.resetFields();
        setIsEdit(false);
    };

    return (
        <>
            {/* Render a loading */}
            {props.loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                    <h1>Loading...</h1>
                </div>
            ) : (
                <>
                    {/* Page Title */}
                    <div style={{ position: 'relative' }}>
                        <h1 style={{ position: 'absolute', left: '10px' }}>
                            {t('form')}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '70px' }}>
                        <Form
                            layout={'inline'}
                            form={form}
                            style={{ maxWidth: '', border: '1px solid black', borderRadius: '10px', padding: '20px', marginBottom: '5px' }}
                            // choose the submit function based on the isEdit state
                            onFinish={isEdit ? handleEditSubmit : handleFormSubmit}
                            key={i18n.language}
                        >
                            <Col>
                                <Row style={{ marginBottom: '10px' }}>

                                    {/* Title */}
                                    <Form.Item name='Title' label={t('title')} rules={[{
                                        required: true,
                                        message: `${t('enter')} '${t('title')}'`,
                                    }]} >
                                        <Select
                                            id='Title'
                                            placeholder={t('title')}
                                            allowClear
                                            value={editingUser?.title}
                                            style={{ width: '100px' }}
                                        >
                                            {titles.map((option) => (
                                                <Select.Option key={option.id} value={option.id}>
                                                    {i18n.language === 'en' ? option.enName : option.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    {/* First Name */}
                                    <Form.Item name='First Name' label={t('f_name')} rules={[{
                                        required: true,
                                        message: `${t('enter')} '${t('f_name')}'`,
                                    }]} style={{ width: '400px' }}>
                                        <Input id='First Name' placeholder="" allowClear />
                                    </Form.Item>

                                    {/* Last Name */}
                                    <Form.Item name='Last Name' label={t('l_name')} rules={[{
                                        required: true,
                                        message: `${t('enter')} '${t('l_name')}'`,
                                    }]} style={{ width: '400px' }}>
                                        <Input id='Last Name' placeholder="" allowClear />
                                    </Form.Item>
                                </Row>

                                <Row style={{ marginTop: '10px', marginBottom: '10px' }}>

                                    {/* Birth Date */}
                                    <Form.Item name='Birth Date' label={t('birth')} rules={[{
                                        required: true,
                                        message: `${t('enter')} '${t('birth')}'`,
                                    }]}>
                                        <DatePicker placeholder={t('date_placeholder')} allowClear />
                                    </Form.Item>

                                    {/* Nationality */}
                                    <Form.Item name='Nationality' label={t('nationality')} rules={[{
                                        required: true,
                                        message: `${t('enter')} '${t('nationality')}'`,
                                    }]}>
                                        <Select
                                            id='Nationality'
                                            placeholder={t('nationality')}
                                            allowClear
                                            style={{ width: '400px', textAlign: 'left' }}
                                        >
                                            {sortedNationalities.map((option) => (
                                                <Select.Option key={option.alpha3} value={option.alpha3}>
                                                    {i18n.language === 'en' ? option.enName : option.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Row>

                                <Row style={{ marginTop: '10px', marginBottom: '10px' }}>

                                    {/* ID Number split to 5 input */}
                                    <Form.Item name='idNumber' label={t('id_number')} rules={[{ validator: validateIDNumber }]}>
                                        <Row align="middle" gutter={0} style={{ flexWrap: 'nowrap' }}>
                                            <Form.Item name="ID1" noStyle initialValue="">
                                                <Input
                                                    style={{ width: '100px', borderRadius: '6px', marginRight: '5px', textAlign: 'center' }}
                                                    maxLength={1}
                                                    placeholder=""
                                                    onKeyDown={handleNumber}
                                                />
                                            </Form.Item>
                                            <span className='dash'>-</span>
                                            <Form.Item name="ID2" noStyle initialValue="">
                                                <Input
                                                    style={{ width: '150px', borderRadius: '6px', marginLeft: '5px', marginRight: '5px', textAlign: 'center' }}
                                                    maxLength={4}
                                                    placeholder=""
                                                    onKeyDown={handleNumber}
                                                />
                                            </Form.Item>
                                            <span className='dash'>-</span>
                                            <Form.Item name="ID3" noStyle initialValue="">
                                                <Input
                                                    style={{ width: '170px', borderRadius: '6px', marginLeft: '5px', marginRight: '5px', textAlign: 'center' }}
                                                    maxLength={5}
                                                    placeholder=""
                                                    onKeyDown={handleNumber}
                                                />
                                            </Form.Item>
                                            <span className='dash'>-</span>
                                            <Form.Item name="ID4" noStyle initialValue="">
                                                <Input
                                                    style={{ width: '120px', borderRadius: '6px', marginLeft: '5px', marginRight: '5px', textAlign: 'center' }}
                                                    maxLength={2}
                                                    placeholder=""
                                                    onKeyDown={handleNumber}
                                                />
                                            </Form.Item>
                                            <span className='dash'>-</span>
                                            <Form.Item name="ID5" noStyle initialValue="">
                                                <Input
                                                    style={{ width: '100px', borderRadius: '6px', marginLeft: '5px', textAlign: 'center' }}
                                                    maxLength={1}
                                                    placeholder=""
                                                    onKeyDown={handleNumber}
                                                />
                                            </Form.Item>
                                        </Row>
                                    </Form.Item>
                                </Row>

                                <Row style={{ marginTop: '10px', marginBottom: '10px' }}>

                                    {/* Gender */}
                                    <Form.Item name='Gender' label={t('gender')} rules={[{
                                        required: true,
                                        message: `${t('enter')} '${t('gender')}'`,
                                    }]}>
                                        <Radio.Group>
                                            {genders.map((option) => (
                                                <Radio key={option.id} value={option.id}>
                                                    {i18n.language === 'en' ? option.enName : option.name}
                                                </Radio>
                                            ))}
                                        </Radio.Group>
                                    </Form.Item>
                                </Row>

                                <Row style={{ marginTop: '10px', marginBottom: '10px' }}>

                                    {/* Phone Number split to Dial code and Number */}
                                    <Form.Item
                                        name='phoneNumber'
                                        label={t('phone_number')}
                                        rules={[
                                            {
                                                required: true,
                                                message: '',
                                            },
                                        ]}
                                    >
                                        <Row align="middle" gutter={0} style={{ flexWrap: 'nowrap' }}>

                                            {/* Dial Code */}
                                            <Form.Item name="Dial Code" noStyle rules={[
                                                {
                                                    required: true,
                                                    message: `${t('enter')} '${t('dial_code')}'`,
                                                },
                                            ]}>
                                                <Select
                                                    style={{ width: '110px', borderRadius: '6px', marginRight: '10px' }}
                                                    placeholder=""
                                                    allowClear
                                                >
                                                    {sortedDial.map((option) => (
                                                        <Select.Option key={option} value={option}>
                                                            {option}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>

                                            <span className='dash'>-</span>

                                            {/* Number */}
                                            <Form.Item name="Phone Number" noStyle rules={[
                                                {
                                                    validator: validatePhoneNumber
                                                }
                                            ]}>
                                                <Input
                                                    style={{ width: '320px', borderRadius: '6px', marginLeft: '10px' }}
                                                    maxLength={12}
                                                    placeholder=""
                                                    onKeyDown={handleNumber}
                                                    allowClear
                                                />
                                            </Form.Item>
                                        </Row>
                                    </Form.Item>
                                </Row>

                                <Row style={{ marginTop: '10px', marginBottom: '10px' }}>

                                    {/* Passport Number */}
                                    <Form.Item name="Passport" label={t('passport')} style={{ width: '400px' }} rules={[{ validator: validatePassport }]}>
                                        <Input id='Passport' placeholder="" maxLength={9} allowClear />
                                    </Form.Item>
                                </Row>

                                <Row style={{ marginTop: '10px' }}>

                                    {/* Expected Salary */}
                                    <Form.Item name="Expected Salary" label={t('salary')} style={{ width: '400px', marginRight: '200px' }} rules={[{ required: true, validator: validateSalary }]}>
                                        <Input id='Salary' placeholder="" onKeyDown={handleNumber} allowClear />
                                    </Form.Item>

                                    {/* Clear Button */}
                                    <Button onClick={() => handleClearForm()} style={{ marginRight: '50px' }} >{t('clear')}</Button>

                                    {/* Submit Button */}
                                    <Button htmlType='submit'>{isEdit ? t('edit') : t('submit')}</Button>
                                </Row>
                            </Col>
                        </Form>
                        <Col>
                            <Row align="middle" gutter={0} style={{ flexWrap: 'nowrap', marginTop: '20px' }}>

                                {/* Select All Checkbox*/}
                                <Checkbox
                                    checked={allSelected}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                >
                                    {t('all')}
                                </Checkbox>

                                {/* Delete Selected Users Button */}
                                <Button onClick={() => handleDeleteUsers(selectedUserIds)}>{t('delete_data')}</Button>
                            </Row>

                            {/* Table */}
                            <Table columns={columns} dataSource={userData} pagination={{ pageSize: 3, position: ['bottomCenter'] }} style={{ marginTop: '5px' }} />
                        </Col>
                    </div>
                </>
            )}
        </>
    )
}

export default FormPage