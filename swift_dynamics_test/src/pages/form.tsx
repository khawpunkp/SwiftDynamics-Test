import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select, Space, Table } from 'antd';
import nationalities from '../data/nationalities.json';
import dialCodes from '../data/dialing code.json';
import titles from '../data/title.json';
import genders from '../data/gender.json';
import './form.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch, userActions, User } from '../store/reducer';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { SortOrder } from 'antd/es/table/interface';

function FormPage() {
    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const [allSelected, setAllSelected] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const uniqueDialCodes = dialCodes
        .map((option) => option.dial_code)
        .filter((dialCode, index, array) => array.indexOf(dialCode) === index);


    const clearForm = () => {
        form.resetFields();
        console.log('User Data:', userData);
    };

    // Access user data from the store
    const userData = useSelector((state: RootState) => state.users);

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const columns = [
        {
            title: '',
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

                // Determine the nationality label based on the current language
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

    const handleSelect = (userId: string) => {
        setSelectedUserIds((prevSelectedUserIds) => {
            if (prevSelectedUserIds.includes(userId)) {
                return prevSelectedUserIds.filter((id) => id !== userId);
            } else {
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

    // Dispatch actions to update user data
    const dispatch = useDispatch<AppDispatch>();

    const handleNumber = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(event.key) && !(event.key === 'Backspace')) {
            event.preventDefault();
        }
    };

    const sortedNationalities = nationalities.sort((a, b) =>
        i18n.language === 'en' ? a.enName.localeCompare(b.enName) : a.name.localeCompare(b.name)
    );

    const sortedDial = uniqueDialCodes.sort((a, b) => {
        const codeA = parseInt(a.replace("+", ""));
        const codeB = parseInt(b.replace("+", ""));
        return codeA - codeB;
    });

    const handleFormSubmit = (values: any) => {
        const birthDate = values['Birth Date'];
        const serializedBirthDate = moment(birthDate).format('YYYY-MM-DD');

        const telNumber = values['Dial Code'] + values['Phone Number'];

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
            salary: values['Expected Salary'],
        };

        dispatch(userActions.addUser(formData));

        form.resetFields();
    };

    const handleDeleteUsers = (idsToRemove: string[]) => {
        setAllSelected(false);
        dispatch(userActions.removeUsers(idsToRemove));
    };

    const handleDeleteUser = (idToRemove: string) => {
        dispatch(userActions.removeUser(idToRemove));
    };

    const handleEditUser = (idToEdit: string) => {
        const userToEdit = userData.find((user) => user.id === idToEdit) || null;
        setEditingUser(userToEdit);
    };

    useEffect(() => {
        console.log('Editing User:', editingUser);
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
            setIsEdit(true);
        }
    }, [editingUser]);

    const handleEditSubmit = (values: any) => {
        if (!editingUser) {
            // Handle the case when editingUser is null
            return;
        }

        const birthDate = values['Birth Date'];
        const serializedBirthDate = moment(birthDate).format('YYYY-MM-DD');

        const telNumber = values['Dial Code'] + values['Phone Number'];

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
            salary: values['Expected Salary'],
        };

        dispatch(userActions.updateUser({ id: editingUser.id, user: formData }));

        form.resetFields();
        setIsEdit(false);
    };


    useEffect(() => {
        if (editingUser) {
            form.setFieldsValue(editingUser);
        }
    }, [editingUser, form]);

    return (
        <>
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
                    onFinish={isEdit ? handleEditSubmit : handleFormSubmit}
                >
                    <Col>
                        <Row style={{ marginBottom: '10px' }}>
                            <Form.Item name='Title' label={t('title')} rules={[{ required: true }]}>
                                <Select
                                    id='Title'
                                    placeholder={t('title')}
                                    allowClear
                                    value={editingUser?.title}
                                >
                                    {titles.map((option) => (
                                        <Select.Option key={option.id} value={option.id}>
                                            {i18n.language === 'en' ? option.enName : option.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name='First Name' label={t('f_name')} rules={[{ required: true }]} style={{ width: '400px' }}>
                                <Input id='First Name' placeholder="" />
                            </Form.Item>

                            <Form.Item name='Last Name' label={t('l_name')} rules={[{ required: true }]} style={{ width: '400px' }}>
                                <Input id='Last Name' placeholder="" />
                            </Form.Item>
                        </Row>

                        <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                            <Form.Item name='Birth Date' label={t('birth')} rules={[{ required: true }]}>
                                <DatePicker placeholder={t('date_placeholder')} />
                            </Form.Item>

                            <Form.Item name='Nationality' label={t('nationality')} rules={[{ required: true }]}>
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
                            <Form.Item name='idNumber' label={t('id_number')} >
                                <Row align="middle" gutter={0} style={{ flexWrap: 'nowrap' }}>
                                    <Form.Item name="ID1" noStyle>
                                        <Input
                                            style={{ width: '100px', borderRadius: '6px', marginRight: '5px' }}
                                            maxLength={1}
                                            placeholder=""
                                            onKeyDown={handleNumber}
                                        />
                                    </Form.Item>
                                    <span className='dash'>-</span>
                                    <Form.Item name="ID2" noStyle>
                                        <Input
                                            style={{ width: '150px', borderRadius: '6px', marginLeft: '5px', marginRight: '5px' }}
                                            maxLength={4}
                                            placeholder=""
                                            onKeyDown={handleNumber}
                                        />
                                    </Form.Item>
                                    <span className='dash'>-</span>
                                    <Form.Item name="ID3" noStyle>
                                        <Input
                                            style={{ width: '170px', borderRadius: '6px', marginLeft: '5px', marginRight: '5px' }}
                                            maxLength={5}
                                            placeholder=""
                                            onKeyDown={handleNumber}
                                        />
                                    </Form.Item>
                                    <span className='dash'>-</span>
                                    <Form.Item name="ID4" noStyle>
                                        <Input
                                            style={{ width: '120px', borderRadius: '6px', marginLeft: '5px', marginRight: '5px' }}
                                            maxLength={2}
                                            placeholder=""
                                            onKeyDown={handleNumber}
                                        />
                                    </Form.Item>
                                    <span className='dash'>-</span>
                                    <Form.Item name="ID5" noStyle>
                                        <Input
                                            style={{ width: '100px', borderRadius: '6px', marginLeft: '5px' }}
                                            maxLength={1}
                                            placeholder=""
                                            onKeyDown={handleNumber}
                                        />
                                    </Form.Item>
                                </Row>
                            </Form.Item>
                        </Row>

                        <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                            <Form.Item name='Gender' label={t('gender')} rules={[{ required: true }]}>
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
                            <Form.Item name='phoneNumber' label={t('phone_number')} rules={[{ required: true,
                                                message: 'Please enter =', }]}>
                                <Row align="middle" gutter={0} style={{ flexWrap: 'nowrap' }}>
                                    <Form.Item
                                        name="Dial Code"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter the dial code',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        name="Phone Number"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter the phone number',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Row>
                            </Form.Item>
                        </Row>

                        <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                            <Form.Item name="Passport" label={t('passport')} style={{ width: '400px' }}>
                                <Input id='Passport' placeholder="" maxLength={9} />
                            </Form.Item>
                        </Row>

                        <Row style={{ marginTop: '10px' }}>
                            <Form.Item name="Expected Salary" label={t('salary')} style={{ width: '400px', marginRight: '200px' }} rules={[{ required: true }]}>
                                <Input id='Salary' placeholder="" onKeyDown={handleNumber} />
                            </Form.Item>

                            <Button onClick={() => clearForm()} style={{ marginRight: '50px' }} >{t('clear')}</Button>

                            <Button htmlType='submit'>{isEdit ? t('edit') : t('submit')}</Button>
                        </Row>
                    </Col>
                </Form>
                <Col>
                    <Row align="middle" gutter={0} style={{ flexWrap: 'nowrap', marginTop: '20px' }}>
                        <Checkbox
                            checked={allSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                        >
                            {t('all')}
                        </Checkbox>
                        <Button onClick={() => handleDeleteUsers(selectedUserIds)}>{t('delete_data')}</Button>
                    </Row>
                    <Table columns={columns} dataSource={userData} pagination={{ pageSize: 3, position: ['bottomCenter'] }} style={{ marginTop: '5px' }} />
                </Col>
            </div>
        </>
    )
}

export default FormPage